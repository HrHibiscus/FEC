const express = require('express')
const router = express.Router()
const axios = require('axios')
// const APIKEY = require('../config.js').APIKEY
const APIKEY = process.env.APIKEY
const apiURL = process.env.API_URL
// let apiURL = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe'

// router.use(express.urlencoded({extended: true}));
// router.use(express.json());

const logInteraction = (bodyParams) => {
  axios.post(apiURL + '/interactions', bodyParams, {
    headers: {'Authorization': APIKEY}
  })
  .then((apiRes) => {
    console.log('successfully logged interaction :', apiRes.data)
  })
  .catch((err) => {
    console.log('err in logInteractions :', err)
  })
}

//be sure to go back and update log interaction args as needed
//TODO: refactor
// // get sorted reviews
// router.get('/sort', (req, res)=>{
//   console.log('TESTING SORT ROUTE', req.data)
//   // .then((req)=>{
//   //   res.status(200).send(req)
//   // })
//   // .catch((err)=>{
//   //   console.log('err on sort route', err)
//   //   res.status(400).send(err)
//   // })
// })

// get sorted reviews
router.get('/sortreviews/:review/sort/:sort', (req, res)=>{
  // console.log('sort param', req.params)
  console.log('productID param', req.params.review)
  console.log('sort param', req.params.sort)
  axios.get(apiURL + `/reviews/?product_id=${req.params.review}&count=1000&sort=${req.params.sort}`, {
    headers:
     {'Authorization': APIKEY}}
    )
    .then((data)=>{
      res.status(200).send(data.data)
      logInteraction({
        'element': 'Reviews.jsx',
        'widget': 'reviews',
        'time': new Date()
      })
    })
    .catch((err)=>{
      console.log('error in get all reviews', err)
      res.status(400).send(err)
    })
})

router.put('/helpful', (req, res)=>{
  console.log('testing helpful route', req.body)
  const endpoint = req.body.isHelpful === 'true' ? 'helpful' : 'report'
  console.log('testing endpoint variable', endpoint)
  axios.put(apiURL + `/reviews/${req.body.review_id}/${endpoint}`,req.body,{headers:{'Authorization': APIKEY}})
  .then((data)=>{
    console.log('DATA FROM API', data.data)
    res.status(204).send()
  })
  .catch((err)=>{
    console.log('ERROR ON API', err)
    res.status(400).send(err)
  })
})

//get all reviews route
router.get('/:product_id', (req, res)=>{
// console.log('/REVIEWS GET product id', req.params)
axios.get(apiURL + `/reviews/?product_id=${req.params.product_id}&count=1000`, {
  headers:
   {'Authorization': APIKEY}}
  )
  .then((data)=>{
    res.status(200).send(data.data)
    logInteraction({
      'element': 'Reviews.jsx',
      'widget': 'reviews',
      'time': new Date()
    })
  })
  .catch((err)=>{
    console.log('error in get all reviews', err)
    res.status(400).send(err)
  })
})



// // get sorted reviews
// router.get('/sort', (req, res)=>{
//   console.log('TESTING SORT ROUTE', req.params)
//   // .then((req)=>{
//   //   res.status(200).send(req)
//   // })
//   // .catch((err)=>{
//   //   console.log('err on sort route', err)
//   //   res.status(400).send(err)
//   // })
// })

//this is VERY similar to the above request, but purpose is to get meta data. refactor this eventually after functionality is hit.
router.get('/meta/:product_id', (req, res)=>{
  axios.get(apiURL + `/reviews/meta/?product_id=${req.params.product_id}`, {
    headers:
     {'Authorization': APIKEY}}
    )
    .then((data)=>{
      // console.log('DATA FROM /meta/:product_ID', data.data)
      // console.log('Testing calcRating Average Function in Ratings Object', calcRatingAverages(data.data.ratings) )
      // console.log('Testing totalRatings function', countRatings(data.data.ratings) )
      const sendToClient = {
        countOfRatings: countRatings(data.data.ratings),
        ratingAverages: calcRatingAverages(data.data.ratings),
        rawData: data.data
      }
      // console.log('testing send to client', sendToClient)
      res.status(200).send(sendToClient)
      logInteraction({
        'element': 'Reviews.jsx',
        'widget': 'reviews',
        'time': new Date()
      })
    })
    .catch((err)=>{
      console.log('error in get review metadata', err)
      res.status(400).send(err)
    })
  })


router.post('/newReview', (req, res) => {
  // console.log('REQ FROM SERVER', req.body);
  axios.post(apiURL + '/reviews', req.body, {headers: {'Authorization': APIKEY}})
      .then((data) => {
        res.json(data.data);
        logInteraction({
          'element': 'ReviewForm.jsx',
          'widget': 'reviews',
          'time': new Date()
        });
      })
      .catch((err) => {
        console.error('ERROR IN newReview POST', err.response.data);
        res.status(err.response.status).json(err);
      });
});

//Controller functions
let calcRatingAverages = (ratingsObject) => {
  // takes in all review
  // console.log('ratings object', ratingsObject)
  let totalNumOfRatings = 0
  let totalScoreOfRatings = 0;
  for (key in ratingsObject) {
    totalNumOfRatings += Number(ratingsObject[key])
    totalScoreOfRatings += Number(ratingsObject[key]) * Number(key)
  }

  //calculates rating out of 5, rounded off to 2 decimal places
  const ratingOutOf5 = (totalScoreOfRatings/totalNumOfRatings).toFixed(2)

  //outputs the raw ratings score out out of 100
  const ratingAsPercent = totalScoreOfRatings/(totalNumOfRatings * 5) * 100

  //outputs the rating score rounded off to the nearest 25%
  const ratingAsPercentRounded = (Math.round(ratingAsPercent * 4) / 4).toFixed(2)

  return {ratingOutOf5: ratingOutOf5,
    ratingAsPercentRounded: ratingAsPercentRounded
  }
}

//count total # of ratings
const countRatings = (ratingsObject) => {
  // console.log('RATINGS OBJECT', ratingsObject)
  let countOfRatings = 0;

  for (let key in ratingsObject) {
    countOfRatings += +ratingsObject[key]
  }

  return countOfRatings
}





module.exports = router