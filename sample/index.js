require('dotenv').config()

const passport = require('passport')
const express = require('express')
const NaverStrategy = require('../build/passport-naver.js').Strategy

const PORT = process.env.PORT || 3000

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.API_KEY,
      clientSecret: process.env.CLIENT_SECRET_KEY,
      callbackURL: 'http://localhost:3000/callback',
    },
    (accessToken, refreshToken, params, profile, done) => {
      // 계정 관련 구현 부분

      return done(null, profile._json)
    }
  )
)
passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

const app = express()
app.use(passport.initialize())
app.get('/login', passport.authenticate('naver', { state: 'sampleState' }))
app.get('/callback', passport.authenticate('naver'), (req, res) => {
  res.send('result :' + JSON.stringify({ state: req.query.state, user: req.user }))
})

app.listen(PORT, () => {
  console.log(`💡Server is running on ${PORT}`)
})
