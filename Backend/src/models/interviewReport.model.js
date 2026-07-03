const mongoose = require('mongoose');

const interviewReportSchema = new mongoose.Schema({           // Define the schema for the interview report
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    resume: {
        type:String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },

    technicalQuestions: [{
    _id: false,

    question: {
        type: String,
        required: true
    },

    intention: {
        type: String,
        required: true
    },

    answer: {
        type: String,
        required: true
    }
}],
    behavioralQuestions: [{
    _id: false,

    question: {
        type: String,
        required: true
    },

    intention: {
        type: String,
        required: true
    },

    answer: {
        type: String,
        required: true
    }
}],
    skillGaps: [{
            _id: false,
            skill: {
                type: String,
                required: [true, "Skill is required"]
            },
            severity: {
                type: String,
                enum: ['low', 'medium', 'high'],
                required: [true, "Severity is required"]
            }
    }],
    preparationPlan: [
        {
            day: {
                type: Number,
                required: [true, "Day is required"]
            },
            focus: {
                type: String,
                required: [true, "Focus is required"]
            },
            tasks: [{
                type: String,
                required: [true, "Tasks is required"]
            }]
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        required: [true, "Job title is required"]
    }
}, {
    timestamps: true   // ye timestamps ka use karte hai taki hame pata chale ki ye document kab create hua aur kab update hua
})

const interviewReportModel = mongoose.model("interviewReports", interviewReportSchema); // Create a model for the interview report schema

module.exports = interviewReportModel; // Export the model for use in other parts of the application