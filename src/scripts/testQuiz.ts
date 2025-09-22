import mongoose from 'mongoose';
import QuizSubmission from '../models/QuizSubmission';
import Lesson from '../models/Lesson';
import Earning from '../models/Earning';
import Settings from '../models/Settings';
import dotenv from 'dotenv';

dotenv.config();

async function testQuizSystem() {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log('Connected to MongoDB');

    // Get a lesson with quiz
    const lesson = await Lesson.findOne({ isPublished: true });
    if (!lesson) {
      console.log('No published lessons found');
      return;
    }

    console.log(`Testing quiz for lesson: ${lesson.title}`);
    console.log(`Quiz has ${lesson.quiz.length} questions`);

    // Test quiz submission data
    const testDeviceId = 'test_device_789';
    const testAnswers = [2, 1, 2]; // Correct answers: [2, 1, 2]
    const testTimeSpent = 90; // 1.5 minutes (speed bonus)

    // Calculate score
    let correctAnswers = 0;
    const quizResults = lesson.quiz.map((question, index) => {
      const userAnswer = testAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
      }
      
      return {
        questionIndex: index,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      };
    });

    const score = Math.round((correctAnswers / lesson.quiz.length) * 100);
    const passed = score >= 70;

    console.log(`\nQuiz Results:`);
    console.log(`Score: ${score}%`);
    console.log(`Passed: ${passed}`);
    console.log(`Correct Answers: ${correctAnswers}/${lesson.quiz.length}`);

    // Calculate rewards
    const settings = await Settings.findOne();
    let coinsEarned = 0;
    let usdEarned = 0;

    if (passed) {
      coinsEarned = 20; // Base quiz completion reward
      
      if (score === 100) {
        coinsEarned += 10; // Perfect score bonus
      }
      
      if (testTimeSpent < 120) {
        coinsEarned += 5; // Speed bonus
      }
      
      usdEarned = coinsEarned * (settings?.coinToUsdRate || 0.001);
    }

    console.log(`\nRewards:`);
    console.log(`Coins Earned: ${coinsEarned}`);
    console.log(`USD Earned: $${usdEarned.toFixed(4)}`);

    // Create test quiz submission
    const submission = await QuizSubmission.create({
      deviceId: testDeviceId,
      lessonId: (lesson._id as any).toString(),
      answers: testAnswers,
      score,
      passed,
      timeSpent: testTimeSpent,
      coinsEarned,
      usdEarned
    });

    console.log(`\nQuiz submission created with ID: ${submission._id}`);

    // Test quiz history
    const history = await QuizSubmission.find({ deviceId: testDeviceId })
      .populate('lessonId', 'title category')
      .sort({ createdAt: -1 });

    console.log(`\nQuiz History for device ${testDeviceId}:`);
    console.log(`Total submissions: ${history.length}`);

    // Test statistics
    const stats = await QuizSubmission.aggregate([
      { $match: { deviceId: testDeviceId } },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          passedQuizzes: { $sum: { $cond: ['$passed', 1, 0] } },
          averageScore: { $avg: '$score' },
          totalCoinsEarned: { $sum: '$coinsEarned' },
          totalUsdEarned: { $sum: '$usdEarned' }
        }
      }
    ]);

    console.log(`\nStatistics:`);
    console.log(JSON.stringify(stats[0] || {}, null, 2));

    console.log('\n✅ Quiz system test completed successfully!');

  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testQuizSystem();
