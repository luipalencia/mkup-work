const Tour = require('./../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = 'rating,price';
    req.query.fields = 'name,price,rating';
    next()
}

exports.getAllTours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
    const tours = await features.query;

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
})

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
        return next(new AppError('No tour found with taht ID', 404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
})

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    })
})

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!tour) {
        return next(new AppError('No tour found with taht ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
})
exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndRemove(req.params.id)

    if (!tour) {
        return next(new AppError('No tour found with taht ID', 404))
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { rating: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: '$duration',
                numTours: { $sum: 1 },
                avgRating: { $avg: '$rating' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: {
                avgPrice: 1
            }
        },
        {
            $match: { _id: { $ne: null } }
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    })
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([]);

    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    })
})