const Session = require('../models/Session');
const Recording = require('../models/Recording');
const emailService = require('../services/emailService');

// Create a new session
exports.createSession = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      teacherId, 
      teacherName,
      learnerIds = [], 
      gmeetLink, 
      scheduledTime, 
      duration,
      isPublished = false,
      status = 'upcoming',
      category = 'general',
      skills = [],
      price = 0,
      maxLearners = 1,
      sessions = []
    } = req.body;

    if (!title || !description || !teacherId || !scheduledTime || !duration) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const session = await Session.create({
      title,
      description,
      teacher: teacherId,
      teacherName,
      learners: Array.isArray(learnerIds) ? learnerIds : [],
      scheduledTime: new Date(scheduledTime),
      duration: Number(duration),
      recordingLink: gmeetLink || null,
      isPublished: Boolean(isPublished),
      status,
      category,
      skills: Array.isArray(skills) ? skills : [],
      price: Number(price),
      maxLearners: Number(maxLearners),
      sessions: Array.isArray(sessions) ? sessions.map(s => ({
        date: s.date ? new Date(s.date) : null,
        startTime: s.startTime,
        endTime: s.endTime,
        meetingLink: s.meetingLink || '',
        location: s.location || '',
        isRecurring: Boolean(s.isRecurring),
        recurringPattern: s.recurringPattern || '',
        recurringEndDate: s.recurringEndDate ? new Date(s.recurringEndDate) : null
      })) : []
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error creating session', error: error.message });
  }
};

// Set or update GMeet link and notify learners
exports.setGMeetLink = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { gmeetLink } = req.body;
    if (!gmeetLink) return res.status(400).json({ message: 'gmeetLink is required' });

    const session = await Session.findById(sessionId).populate('learners');
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.recordingLink = gmeetLink;
    await session.save();

    const emails = (session.learners || []).map((u) => u.email).filter(Boolean);
    await Promise.all(emails.map((to) => emailService.sendGMeetLink(to, session.title, gmeetLink)));

    res.status(200).json({ message: 'GMeet link set and learners notified', session });
  } catch (error) {
    res.status(500).json({ message: 'Error setting GMeet link', error: error.message });
  }
};

// Get all sessions for the logged-in user
exports.getUserSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const teachingSessions = await Session.find({ teacher: userId })
      .sort({ createdAt: -1 });
    
    const learningSessions = await Session.find({ 
      learners: { $in: [userId] },
      teacher: { $ne: userId } // Exclude sessions where user is both teacher and learner
    }).sort({ createdAt: -1 });

    res.status(200).json({
      teaching: teachingSessions,
      learning: learningSessions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error: error.message });
  }
};

// Get session details
exports.getSessionDetails = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId).populate('teacher learners');
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching session details', error: error.message });
  }
};

// Record a session
exports.recordSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { recordingUrl } = req.body;
    if (!recordingUrl) return res.status(400).json({ message: 'recordingUrl is required' });
    const newRecording = new Recording({ sessionId, recordedUrl: recordingUrl });
    await newRecording.save();
    res.status(201).json({ message: 'Recording saved successfully', recording: newRecording });
  } catch (error) {
    res.status(500).json({ message: 'Error saving recording', error: error.message });
  }
};

// Get all recordings for a session
exports.getSessionRecordings = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const recordings = await Recording.find({ sessionId });
    res.status(200).json(recordings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recordings', error: error.message });
  }
};

// Track attendance for a session
exports.trackAttendance = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.body;
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    const set = new Set((session.learners || []).map(String));
    set.add(String(userId));
    session.learners = Array.from(set);
    await session.save();
    res.status(200).json({ message: 'Attendance tracked successfully', session });
  } catch (error) {
    res.status(500).json({ message: 'Error tracking attendance', error: error.message });
  }
};