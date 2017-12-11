// $(document).ready(function() {
// 	// $('#driver').hide();
// 	// $('#passenger').hide();
// 	// $('#newPassenger').hide();
// 	// $('#newDriver').hide()

// 	let routes_passenger = $('#routes').data('routes_passenger')
// 	let routes_driver = $('#routes').data('routes_driver')
// 	let message_driver = $('#routes').data('message_driver')
// 	let message_passenger = $('#routes').data('message_passenger')

// 	console.log(routes_passenger)
// 	console.log(routes_driver)
// 	console.log(message_driver)
// 	console.log(message_passenger)
// 	let user = $('#user').data('user')

// 		for(let i=0; i < routes.length; i++) {			
// 			if (user.username === routes[i].driver.username) {
// 				$('#driver').show();
// 				// if there is no passengers, the routes[i].passenger.username returns undefined
// 				// that's why we have to use: routes[i].passenger !== null 
// 			} else if (routes[i].passenger !== null && user.username === routes[i].passenger.username) {
// 				$('#passenger').show()
// 			} else if (user.status === 'passenger') {
// 				$('#newPassenger').show()
// 			} else if (user.status === 'driver' && user.username !== routes[i].driver.username) {
// 				$('#newDriver').show()
// 			}
// 		}
// })