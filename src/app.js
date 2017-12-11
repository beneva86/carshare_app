const Sequelize = require('sequelize') 
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const bcrypt = require('bcrypt');
const saltRounds = 10;

const Op = Sequelize.Op;
// const connection = new Sequelize('carshare_app',process.env.POSTGRES_USER,null,{ operatorsAliases: false });

// CONFIG dependencies
const app = express()

// connect to the database
const sequelize = new Sequelize('carshare_app',process.env.POSTGRES_USER,null,{
  host: 'localhost',
  dialect: 'postgres',
  storage: './session.postgres' 
})

app.use(express.static('public'))

app.set('views','views')
app.set('view engine','pug')

app.use(bodyParser.urlencoded({extended: true}))

app.use(session({
  secret: "safe",         
  saveUnitialized: true,  
  resave: false,         
  store: new SequelizeStore({
    db: sequelize,  
    checkExpirationInterval: 15 * 60 * 1000, 
    expiration: 24 * 60 * 60 * 1000 
  })
}))

// -------------- MODELS DEFINITION --------------

const Passenger = sequelize.define('passengers', {
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  password: {
    type: Sequelize.STRING
  },
  firstname: {
    type: Sequelize.STRING
  },
  lastname: {
    type: Sequelize.STRING
  },
  phone_number: {
    type: Sequelize.STRING
  },
  flight_number: {
    type: Sequelize.STRING
  },
  flight_date: {
    type: Sequelize.STRING
  },
  start_point: {
    type:Sequelize.STRING
  },
  pickup_point1: {
    type: Sequelize.STRING
  },
  pickup_point2: {
    type: Sequelize.STRING
  },
  pickup_point3: {
    type: Sequelize.STRING
  },
  reserved_seats: {
    type:Sequelize.INTEGER
  },
  score: {
    type: Sequelize.DECIMAL
  },
  phone_number: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.STRING
  }
})

const Driver = sequelize.define('drivers', {
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
      unique: true
  },
  password: {
    type: Sequelize.STRING
  },
  firstname: {
    type: Sequelize.STRING
  },
  lastname: {
    type: Sequelize.STRING
  },
  phone_number: {
    type: Sequelize.STRING
  },
  score: {
    type: Sequelize.DECIMAL
  },
  status: {
    type: Sequelize.STRING
  }
})

const Route = sequelize.define('routes', {
  // price: {
  //   type: Sequelize.ARRAY(Sequelize.INTEGER)
  // },
  depart_city: {
    type: Sequelize.STRING
  },
  pickup_point1: {
    type: Sequelize.STRING
  },
  pickup_point2: {
    type: Sequelize.STRING
  },
  pickup_point3: {
    type: Sequelize.STRING
  },
  available_seats: {
    type: Sequelize.INTEGER
  },
  date: {
    type: Sequelize.DATEONLY
  },
  time: {
    type: Sequelize.STRING
  },
  flight_number: {
     type: Sequelize.STRING
  },
  car_reg: {
    type: Sequelize.STRING
  },
  driver_phonenumber: {
    type: Sequelize.STRING
  }
})


// TABLES RELATIONSHIP/ASSOCIATION 
Driver.hasMany(Passenger)   // foreign key in the target (passengers --> driverId)
Passenger.belongsTo(Driver) 
Route.belongsTo(Passenger)  // foreign key in the source (routes --> passengerId)
Route.belongsTo(Driver)    // foreign key in the source (routes --> driverId)
Driver.hasMany(Route)
Passenger.hasMany(Route)

//----------------ROUTES----------------

//ROUTE: HOME------------------------

app.get('/', (req,res) => {
  const user = req.session.user
  const message = req.query.message
  res.render('index', {message: message})
})

//ROUTE: SHOW THE LOGIN /SIGNUP PAGE
app.get('/loginsignup', (req, res) => {
  const message = req.query.message
  res.render('loginsignup', {message: message})
})

//POST ROUTE FOR SIGNUP
app.post('/signup', (req, res) => {
  const firstname = req.body.firstname
  const lastname = req.body.lastname 
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  const phone_number = req.body.phonenumber
  const checkbox = req.body.passenger

  if (checkbox === 'on') {
    Passenger.findOne({
    where: {
      username: username
    }
  }).then((returnUser) =>{
    if(returnUser !== null) {
      res.redirect('/loginsignup?message=' + encodeURIComponent('This username is already in use. Please, select another username!'))
    } else {
    Passenger.findOne({
      where: {
        email: email
      }
    }).then((returnEmail)=> {
    if(returnEmail!==null) {
      res.redirect('/loginsignup?message=' + encodeURIComponent('This email address is already in use'))
    } else {
      bcrypt.hash(password, saltRounds).then(function(hash) {
        return hash 
      }).then ((hash) => { 
        Passenger.create({
          firstname: firstname,
          lastname: lastname,
          username: username,
          email: email,
          password: hash,
          phone_number: phone_number,
          status: 'passenger'
      }).then( (user) => {
        res.redirect('/loginsignup?message=' + encodeURIComponent('Your profile is successfully created. You can log in now!'))
      })
      })
    }
  })
  }
  })
  .catch(function(err) {
    console.log(err);
  })
  } else {
    Driver.findOne({
    where: {
      username: username
    }
  }).then((returnUser) =>{
    if(returnUser !== null) {
      res.redirect('/loginsignup?message=' + encodeURIComponent('This username is already in use. Please select another username!'))
    } else {
    Driver.findOne({
      where: {
        email: email
      }
    }).then((returnEmail)=> {
    if(returnEmail!==null) {
      res.redirect('/loginsignup?message=' + encodeURIComponent('This email address is already in use'))
    } else {
      bcrypt.hash(password, saltRounds).then(function(hash) {
        return hash 
      }).then ((hash) => { 
        Driver.create({
          firstname: firstname,
          lastname: lastname,
          username: username,
          email: email,
          password: hash,
          phone_number: phone_number,
          status: 'driver'
      }).then( (user) => {
        res.redirect('/loginsignup?message=' + encodeURIComponent('Your profile is successfully created. You can log in now!'))
      })
      })
    }
  })
  }
  })
  .catch(function(err) {
    console.log(err);
  })
  } 
})

//POST ROUTE FOR LOGIN
app.post('/login', (request, response) => {
  const username = request.body.username
  const password = request.body.password
  const checkbox = request.body.passenger

    if (checkbox === 'on') {
    Passenger.findOne({
    where: {
      username : username
    }
  }).then((user) =>{
    if(user !== null) {
      bcrypt.compare(password, user.password, function(err,res) {
        if (res) {
          request.session.user = user  
          request.session.user.status = 'passenger'  
          console.log('REQUEST SESSION LOGIN IS: ' + JSON.stringify(request.session))     
          // response.redirect('/search')
          response.render('search', {user: user})
        } else {
          response.redirect('/loginsignup?message=' + encodeURIComponent('Incorrect password'))
        }
      })
    } else {
          response.redirect('/loginsignup?message=' + encodeURIComponent('Passenger doesn\'t exist'))
    }
})
} else {
  Driver.findOne({
    where: {
      username : username
    }
  }).then((user) =>{
    if(user !== null) {
      bcrypt.compare(password, user.password, function(err,res) {
        if (res) {
          request.session.user = user   
          request.session.user.status = 'driver'  
          // response.redirect('/addroute')
          response.render('addroute', {user: user})
        } else {
          response.redirect('/loginsignup?message=' + encodeURIComponent('Incorrect password'))
        }
      })
    } else {
          response.redirect('/loginsignup?message=' + encodeURIComponent('Driver doesn\'t exist'))
    }
})
} 
})

//ROUTE: SHOW THE SEARCH PAGE
app.get('/search', (req, res) => {
  const user = req.session.user
  const message_nomatch = req.query.message_nomatch
  res.render('search', {user: user, message_nomatch: message_nomatch})
})

//ROUTE: GET FOR SEARCH
app.get('/searchresults', (req, res) => {
  const flightnumber = req.query.flightnumber
  const departuredate = req.query.departuredate
  const departuretime = req.query.departuretime
  const pickuppoint1 = req.query.pickuppoint1
  const pickuppoint2 = req.query.pickuppoint2
  const pickuppoint3 = req.query.pickuppoint3
  const requiredseats = req.query.requiredseats

  const departuretime_number = Number(departuretime.replace(':', '.'))
  const pickuppoints = {
    pickuppoint1: pickuppoint1,
    pickuppoint2: pickuppoint2,
    pickuppoint3: pickuppoint3
  }

  Route.findAll({
    where: {
      flight_number: flightnumber,
      date: departuredate,
      available_seats: {
          [Op.gte]: requiredseats  // greater than or equal to requiredseats
        },
      $or: [ 
      // empty fields are problem, because it will be a match
      {pickup_point1: [pickuppoint1, pickuppoint2, pickuppoint3]}, 
      {pickup_point2: [pickuppoint1, pickuppoint2, pickuppoint3]},
      {pickup_point3: [pickuppoint1, pickuppoint2, pickuppoint3]}  
      ]
    }, 
    include: {
      model: Driver
    }
  })
  .then(function(routes) {
    // console.log('ROUTES ARE: ' + JSON.stringify(routes)) // it is an empty array, if there is no match
    if (routes.length !== 0) {
     const matchRoutes = []
    for (let i=0; i < routes.length; i++) {
      // from 10:25 --> 10.25 (it is a string) --> to number 10.25 --> compare with the input time
      if ((Number(routes[i].time.replace(':', '.')) - departuretime_number) <= 1) {
        matchRoutes.push(routes[i])
      }
    }
    // console.log('matchRoutes is: '+ matchRoutes) 
       res.render('details', {matchRoutes: matchRoutes, requiredseats: requiredseats, pickuppoints: pickuppoints})        
    } else {
       res.redirect('/search?message_nomatch=' + encodeURIComponent('There is no available route'))
    }
  }) 
})

//POST REQUEST FOR BOOK BTN ON SEARCH
app.post('/reservation', (req, res) => {
  const user = req.session.user
  const route = req.body.route
  const seats = req.body.requiredseats
  const pickuppoints = req.body.pickuppoints

  Passenger.findOne({
    where: {
      id: user.id
    }
  }).then((passenger) => {
    passenger.update({
      driverId: route.driver.id,
      flight_number: route.flight_number,
      flight_date: route.date,
      reserved_seats: seats,
      pickup_point1: pickuppoints.pickuppoint1,
      pickup_point2: pickuppoints.pickuppoint2,
      pickup_point3: pickuppoints.pickuppoint3,
    })
  })
  Route.findOne({
    where: {
      id: route.id
    }
  }).then((returnRoute) => {
    returnRoute.update({
      passengerId: user.id,
      available_seats: returnRoute.available_seats - seats
    })
    res.redirect(`/confirm/${route.id}`)
})
})

//ROUTE: SHOW THE ADDROUTE PAGE
app.get('/addroute', (req, res) => {
  const user = req.session.user
  res.render('addroute', {user: user})
})

//POST REQUEST FOR ADDING ROUTE
app.post('/addroute', (req, res) => {
  const user = req.session.user
  const flight_date = req.body.flightdate
  const flight_number = req.body.flightnumber
  const depart_city = req.body.departcity
  const departure_date = req.body.departuredate
  const departure_time = req.body.departuretime
  const pickup_point1 = req.body.pickuppoint1
  const pickup_point2 = req.body.pickuppoint2
  const pickup_point3 = req.body.pickuppoint3
  const available_seats = req.body.availableseats 
  const carregistration = req.body.carregistration

  Driver.findOne({
    where: {
      username: user.username
    }
  }).then(function(driver) {
    return driver.createRoute({
      driverId: user.id,
      date: departure_date,
      time: departure_time,
      flight_number: flight_number,
      depart_city: depart_city,
      pickup_point1: pickup_point1,
      pickup_point2: pickup_point2,
      pickup_point3: pickup_point3,
      available_seats: available_seats,
      car_reg: carregistration,
      driver_phonenumber: user.phone_number
    })
  }).then(function(route) {
    res.redirect(`/confirm/${route.id}`);
  })
})

//ROUTE TO SHOW CONFIRMATION PAGE
app.get('/confirm/:routeId', (req, res) => {
  const user = req.session.user
  const routeId = req.params.routeId

  Route.findOne({
    where: {
      id: routeId
    },
    include: [
    {model: Passenger},
    {model: Driver}
    ]
  }).then(function(route) {

    res.render('confirm', {routedetails: route, user: user})
  })
})

//ROUTE TO SHOW DETAILS
app.get('/details', (req, res) => {
  res.render('details')
})

//ROUTE TO SHOW PROFILE
app.get('/profile', (req, res) => {
  const user = req.session.user;
  const userId = req.session.user.id

  if (user === undefined) {
    res.redirect('/?message=' + encodeURIComponent("Please log in to view your profile"));//ROUTE??
  } else if (user.status === 'passenger') {
    Route.findAll({ 
      where: {
        passengerId: user.id
      },
      include: [{
        model: Driver
      }]
    }).then((routes_passenger) => {
       if(routes_passenger.length > 0) {
       res.render('profile', {user: user, routes_passenger: routes_passenger});
      } else {
        res.render('profile', {user: user, message_passenger: 'You don\'t have any route(s)'})
      }
    })
  } else if (user.status === 'driver') {
    Route.findAll({ 
      where: {
        driverId: user.id
      }
    }).then((routes_driver) => {
      if(routes_driver.length > 0) {
       res.render('profile', {user: user, routes_driver: routes_driver});
      } else {
        res.render('profile', {user: user, message_driver: 'You don\'t have any route(s)'})
      }
    })
  }
})

//ROUTE TO LOGOUT
app.get('/logout', (req,res)=> {
  req.session.destroy((error)=> {
    if(error) {
      throw error;
    }
  res.redirect('/?message=' + encodeURIComponent('Successfully logged out'))
  })
})

sequelize.sync()

app.listen(3000, function(){
  console.log("Carshare app is listening on port 3000")
})
