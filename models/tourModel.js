const mongoose = require("mongoose");
const slugify = require('slugify');
const validator = require('validator');

var schemaOptions = {
    toObject: {
        virtuals: true
    }
    , toJSON: {
        virtuals: true
    }
};

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "A tour must have a name"],
            unique: true,
            trim: true,
            maxlength: [40, 'A tour name must have less or equal then 40 characters'],
            minlength: [10, 'A tour name must have more or equal then 10 characters']
            // validate: [validator.isAlpha, 'Tour name must only contain charact']
        },
        duration: {
            type: Number,
            require: [true, "A tour must have a duration"],
        },
        imageCover: {
            type: String,
            required: [true, "A tour must have a cover image"],
        },
        images: [String],
        rating: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0']
        },

        slug: String,
        price: {
            type: Number,
            required: [true, "A tour must have a price"],
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        secretTour: {
            type: Boolean,
            default: false
        }
    },
    schemaOptions
);

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// documente middleware
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next();
});


tourSchema.pre('find', function (next) {
    this.find({ secretTour: { $ne: true } })
    next();
})

tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } })
    next();
})

// aggregation middleware
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
    next()
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
