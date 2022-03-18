// review / rating / createdAt / ref to tour / ref to user

const mongoose = require("mongoose");

const Tour = require("./../models/tourModel");


const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review cannot be empty"]
    },
    rating: {
        type: Number,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be below 5.0"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "Review must be tagged to a tour."]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Review must be tagged to a user."]

    }},
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}

    })

reviewSchema.index( { tour: 1, user: 1}, { unique: true});

reviewSchema.pre(/^find/, function(next) {
    // this.populate({
    //     path: "tour",
    //     select: "name"
    // }).populate({
    //     path: "user",
    //     select: "name photo"
    // })

    this.populate({
        path: "user",
        select: "name photo"
    })

    next();
})

reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: {tour: tourId}
        },
        {
            $group: {
                _id: "$tour",
                numRating: {$sum: 1},
                avgRating: {$avg: "$rating"}
            }
        }
    ])
    // console.log(stats);
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].numRating,
        ratingsAverage: stats[0].avgRating
    
    })}
}

reviewSchema.post("save", function() {
    // this points to current review
    this.constructor.calcAverageRatings(this.tour);
})


reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.clone().findOne()
    next();
})


reviewSchema.post(/^findOneAnd/, async function() {
    // await this.findOne()
    await this.r.constructor.calcAverageRatings(this.r.tour);

})



const Review = new mongoose.model("Review", reviewSchema);

module.exports = Review;
