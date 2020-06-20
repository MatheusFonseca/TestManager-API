const Test = require('../models/Test');
const Classroom = require('../models/Classroom');
const Question = require('../models/Question');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// @desc    Get all tests
// @route   GET /api/v1/tests
// @access  Private
exports.getTests = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single test
// @route   GET /api/v1/tests/:id
// @access  Private
exports.getTest = asyncHandler(async (req, res, next) => {
  const test = await Test.findOne({ _id: req.params.id }).populate('questions');

  if (!test) {
    return next(
      new ErrorResponse(404, `Test not found with id of: ${req.params.id}`)
    );
  }

  res.status(200).json({ success: true, data: test });
});

// @desc    Create test
// @route   POST /api/v1/tests
// @access  Private
exports.createTest = asyncHandler(async (req, res, next) => {
  const classroom = await validateClassroom(next, req.body.classroom);
  await validateQuestions(next, req.body.questions, classroom.course);

  const test = await Test.create(req.body);
  res.status(201).json({ success: true, data: test });
});

// @desc    Update test
// @route   PUT /api/v1/tests/:id
// @access  Private
exports.updateTest = asyncHandler(async (req, res, next) => {
  let test = await Test.findById(req.params.id);

  if (!test) {
    return next(
      new ErrorResponse(404, `Test not found with id of: ${req.params.id}`)
    );
  }

  let classroom;

  if (req.body.classroom) {
    classroom = await validateClassroom(next, req.body.classroom);
  } else {
    classroom = await Classroom.findById(test.classroom);
  }
  if (req.body.questions) {
    await validateQuestions(next, req.body.questions, classroom.course);
  }

  if (test.students && test.students.length > 0) {
    return next(
      new ErrorResponse(
        400,
        `A student submitted this test, it cannot be updated`
      )
    );
  }

  test = await Test.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({ success: true, data: test });
});

// @desc    Delete test
// @route   DELETE /api/v1/tests/:id
// @access  Private
exports.deleteTest = asyncHandler(async (req, res, next) => {
  const test = await Test.findById(req.params.id);

  if (!test) {
    return next(
      new ErrorResponse(404, `Test not found with id of: ${req.params.id}`)
    );
  }

  if (test.students && test.students.length > 0) {
    return next(
      new ErrorResponse(
        400,
        `A student submitted this test, it cannot be deleted`
      )
    );
  }

  test.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Submit test
// @route   PUT /api/v1/tests/submittest/:id
// @access  Private
exports.submitTest = asyncHandler(async (req, res, next) => {
  let test = await Test.findById(req.params.id);

  if (!test) {
    return next(
      new ErrorResponse(404, `Test not found with id of: ${req.params.id}`)
    );
  }

  await validateStudent(next, test, req.body.student);
  await validateSubmittedQuestions(next, test, req.body.questions);

  test = await Test.findByIdAndUpdate(
    { _id: req.params.id },
    { $push: { students: req.body } },
    { runValidators: true, new: true }
  );

  res.status(200).json({ success: true, data: req.body });
});

// Helpers
const validateClassroom = async (next, id) => {
  if (!id) {
    throw next(new ErrorResponse(400, 'Please add a classroom'));
  }

  // Checking if classroom exists
  const classroom = await Classroom.findById(id);
  if (!classroom) {
    throw next(new ErrorResponse(404, `Classroom not found with id of: ${id}`));
  }
  return classroom;
};

const validateQuestions = async (next, questions, testCourse) => {
  // Removing duplicates
  questions = [...new Set(questions)];

  // Checking if questions exist...
  for (value of questions) {
    const question = await Question.findById(value);
    if (!question) {
      throw next(
        new ErrorResponse(404, `Question not found with id of ${value}`)
      );
    }

    // Checking if question has the same course of classroom
    if (question.course.toString() !== testCourse.toString()) {
      throw next(
        new ErrorResponse(
          404,
          `Question must have the same course of the test to which it belongs: ${testCourse}`
        )
      );
    }
  }
};

const validateStudent = async (next, test, studentId) => {
  if (!studentId) {
    throw next(new ErrorResponse(400, 'Please add a student'));
  }

  const student = await User.findById(studentId);

  if (!student) {
    throw next(
      new ErrorResponse(404, `Student not found with id of: ${studentId}`)
    );
  }

  if (student.role !== 'student') {
    throw next(new ErrorResponse(400, `User must have role of 'student'`));
  }

  const students = test.students.map((v) => v.student.toString());

  if (students.includes(studentId)) {
    throw next(
      new ErrorResponse(400, `User ${studentId} already submitted this test`)
    );
  }

  return student;
};

const validateSubmittedQuestions = async (next, test, pQuestions) => {
  let questions = pQuestions;

  if (!questions || questions.length < 1) {
    throw next(new ErrorResponse(400, `Please add questions`));
  }

  const testQuestions = test.questions.map((v) => v._id.toString());

  // Extracting submitted questions which does not belong to the test AND Removing duplicates
  questions = questions.filter(
    (v, i) =>
      testQuestions.includes(v.question) &&
      questions.map((q) => q.question).indexOf(v.question) === i
  );

  // Check if the student submitted all questions of the test
  if (questions.length < testQuestions.length) {
    throw next(new ErrorResponse(400, `Please add all questions of the test`));
  }

  // Saving student's answers
  for (q of questions) {
    // Getting answers for that question
    let answers = (await Question.findById(q.question)).answers.map((v) =>
      v._id.toString()
    );
    // Checking if a answer was chosen
    if (!q.chosenAnswer) {
      throw next(
        new ErrorResponse(
          404,
          `Please add an answer for the question ${q.question}`
        )
      );
    }
    // Checking if the answer is a valid one
    if (!answers.includes(q.chosenAnswer)) {
      throw next(
        new ErrorResponse(
          404,
          `Answer not found with id of: ${q.chosenAnswer} for question ${q.question}`
        )
      );
    }
  }
};
