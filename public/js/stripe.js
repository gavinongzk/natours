import {showAlert} from "./alerts";
const stripe = Stripe("pk_test_51KdudiIheR4JA9vpCypKhd1t86dkkwDhZsAdUogjrap24rEH08NAy1QcqjRaPZmAignzuyldfdHoJoOf3Ijm5hi500JMSEVKhh")
import axios from "axios"

export const bookTour = async tourId => {
    // 1) Get checkout endpoint from API
    try {
    const session = await axios(`http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`)
    
    
    // 2) Create checkout form + charge credit card

    await stripe.redirectToCheckout({
        sessionId: session.data.session.id
    })

    } catch (err) {
        showAlert("error", err)
    }    

}