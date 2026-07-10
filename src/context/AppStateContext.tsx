import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Course, 
  Institution, 
  TranscriptEvaluation, 
  Lead, 
  AuditLog, 
  ScraperLog, 
  SystemUser, 
  AIConfig, 
  ExtractedCourse,
  Message
} from '../types';
import { 
  RECEIVING_COURSES, 
  DEFAULT_INSTITUTION, 
  INITIAL_EVALUATIONS, 
  INITIAL_LEADS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_SCRAPER_LOGS, 
  SYSTEM_USERS 
} from '../services/mockData';

interface AppState {
  institution: Institution;
  receivingCourses: Course[];
  evaluations: TranscriptEvaluation[];
  leads: Lead[];
  auditLogs: AuditLog[];
  scraperLogs: ScraperLog[];
  systemUsers: SystemUser[];
  currentUser: SystemUser;
  notifications: Array<{ id: string; text: string; type: 'success' | 'warning' | 'info'; time: string }>;
  messages: Message[];
}

interface AppStateContextType extends AppState {
  onboardCollege: (instData: Partial<Institution>) => void;
  updateAIConfig: (config: AIConfig) => void;
  addEvaluation: (evaluation: TranscriptEvaluation) => void;
  updateExtractedCourse: (evaluationId: string, courseId: string, updates: Partial<ExtractedCourse>) => void;
  addComment: (evaluationId: string, commentText: string) => void;
  publishEvaluation: (evaluationId: string, notes?: string) => void;
  rejectEvaluation: (evaluationId: string, notes?: string) => void;
  addLead: (lead: Lead) => void;
  updateLeadStatus: (leadId: string, status: Lead['status']) => void;
  addLeadNote: (leadId: string, note: string) => void;
  addCatalogCourse: (course: Course) => void;
  updateCatalogCourse: (course: Course) => void;
  deleteCatalogCourse: (courseId: string) => void;
  addScraperLogEntry: (log: ScraperLog) => void;
  triggerSystemNotification: (text: string, type: 'success' | 'warning' | 'info') => void;
  clearNotification: (id: string) => void;
  switchUser: (userId: string) => void;
  logAction: (action: string, details: string) => void;
  resetAllData: () => void;
  sendMessage: (text: string, attachments?: Array<{ name: string; url: string }>, senderRole?: 'student' | 'staff' | 'system') => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from local storage or mock files
  const [institution, setInstitution] = useState<Institution>(() => {
    const saved = localStorage.getItem('art_institution');
    return saved ? JSON.parse(saved) : DEFAULT_INSTITUTION;
  });

  const [receivingCourses, setReceivingCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('art_courses');
    return saved ? JSON.parse(saved) : RECEIVING_COURSES;
  });

  const [evaluations, setEvaluations] = useState<TranscriptEvaluation[]>(() => {
    const saved = localStorage.getItem('art_evaluations');
    return saved ? JSON.parse(saved) : INITIAL_EVALUATIONS;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('art_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('art_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [scraperLogs, setScraperLogs] = useState<ScraperLog[]>(() => {
    const saved = localStorage.getItem('art_scraper_logs');
    return saved ? JSON.parse(saved) : INITIAL_SCRAPER_LOGS;
  });

  const [currentUser, setCurrentUser] = useState<SystemUser>(() => {
    const saved = localStorage.getItem('art_current_user');
    return saved ? JSON.parse(saved) : SYSTEM_USERS[0];
  });

  const [notifications, setNotifications] = useState<AppState['notifications']>([]);

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('art_messages');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'msg_1',
        sender: 'System Admin',
        senderRole: 'system',
        text: 'Welcome to Knot. Your student profile setup is complete. You can now drop transcripts to get credit reports.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      },
      {
        id: 'msg_2',
        sender: 'Dr. Evelyn Martinez',
        senderRole: 'staff',
        text: 'Hello! I am your assigned transfer advisor. Let me know if you need assistance review mappings or mapping custom equivalents.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      }
    ];
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('art_institution', JSON.stringify(institution));
  }, [institution]);

  useEffect(() => {
    localStorage.setItem('art_courses', JSON.stringify(receivingCourses));
  }, [receivingCourses]);

  useEffect(() => {
    localStorage.setItem('art_evaluations', JSON.stringify(evaluations));
  }, [evaluations]);

  useEffect(() => {
    localStorage.setItem('art_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('art_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('art_scraper_logs', JSON.stringify(scraperLogs));
  }, [scraperLogs]);

  useEffect(() => {
    localStorage.setItem('art_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('art_messages', JSON.stringify(messages));
  }, [messages]);

  // Actions
  const triggerSystemNotification = (text: string, type: 'success' | 'warning' | 'info') => {
    const notifId = `notif_${Date.now()}`;
    const newNotif = {
      id: notifId,
      text,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 10)); // Keep last 10 notifications

    // Auto-dismiss notification after 4 seconds
    setTimeout(() => {
      clearNotification(notifId);
    }, 4000);
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const logAction = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `audit_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role.toUpperCase(),
      action,
      timestamp: new Date().toISOString(),
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const onboardCollege = (instData: Partial<Institution>) => {
    setInstitution(prev => ({
      ...prev,
      ...instData,
      onboarded: true
    }));
    logAction('College Onboarded', `Institution settings configured for ${instData.name || institution.name}.`);
    triggerSystemNotification('College onboarding setup completed!', 'success');
  };

  const updateAIConfig = (config: AIConfig) => {
    setInstitution(prev => ({
      ...prev,
      aiConfig: config
    }));
    logAction('AI Config Updated', 'System parameters for similarity and credit matching updated.');
    triggerSystemNotification('AI parameters saved successfully', 'success');
  };

  const addEvaluation = (evaluation: TranscriptEvaluation) => {
    // Check if evaluation already exists
    setEvaluations(prev => {
      if (prev.some(e => e.id === evaluation.id)) return prev;
      return [evaluation, ...prev];
    });

    // Create student lead automatically from this evaluation
    const totalTransferCredits = evaluation.courses
      .filter(c => c.status === 'approved')
      .reduce((sum, c) => sum + (c.receivingCredits || 0), 0);

    const newLead: Lead = {
      id: `lead_${evaluation.id.split('_').pop() || Date.now()}`,
      studentName: evaluation.studentName,
      studentEmail: evaluation.studentEmail,
      studentPhone: evaluation.studentPhone,
      studentProgram: evaluation.studentProgram,
      sendingInstitution: evaluation.sendingInstitution,
      evaluationDate: new Date().toISOString().split('T')[0],
      leadScore: Math.round((totalTransferCredits / 30) * 100), // lead score formula based on transferable credits
      status: 'new',
      notes: [`AI Evaluation completed. Status is ${evaluation.status.replace('_', ' ')}.`],
      evaluationId: evaluation.id
    };

    setLeads(prev => {
      if (prev.some(l => l.evaluationId === evaluation.id)) return prev;
      return [newLead, ...prev];
    });

    logAction('Transcript Processed', `AI analyzed transcript for student ${evaluation.studentName}.`);
    triggerSystemNotification(`New transcript evaluation for ${evaluation.studentName} is ready!`, 'info');
  };

  const updateExtractedCourse = (evaluationId: string, courseId: string, updates: Partial<ExtractedCourse>) => {
    setEvaluations(prev => prev.map(evalItem => {
      if (evalItem.id !== evaluationId) return evalItem;
      
      const updatedCourses = evalItem.courses.map(c => {
        if (c.id !== courseId) return c;
        
        // Calculate new credit changes if matchedCourse is modified
        const updatedCourse = { ...c, ...updates };
        if (updates.matchedCourseId !== undefined) {
          const matched = receivingCourses.find(rc => rc.id === updates.matchedCourseId);
          if (matched) {
            updatedCourse.matchedCourseCode = matched.code;
            updatedCourse.matchedCourseTitle = matched.title;
            // set credits
            if (updates.receivingCredits === undefined) {
              updatedCourse.receivingCredits = matched.credits;
            }
          } else if (updates.matchedCourseId === null) {
            updatedCourse.matchedCourseCode = null;
            updatedCourse.matchedCourseTitle = null;
            updatedCourse.receivingCredits = 0;
          }
        }
        return updatedCourse;
      });

      // Re-calculate average confidence score
      const totalConf = updatedCourses.reduce((sum, c) => sum + c.confidence, 0);
      const newAvgConf = Math.round((totalConf / updatedCourses.length) * 10) / 10;

      // Log the override history
      const affectedCourse = evalItem.courses.find(c => c.id === courseId);
      const changesText = Object.keys(updates).map(k => `${k}: ${JSON.stringify(updates[k as keyof ExtractedCourse])}`).join(', ');

      return {
        ...evalItem,
        courses: updatedCourses,
        confidenceScore: newAvgConf,
        history: [
          {
            id: `h_override_${Date.now()}`,
            action: 'Course Mapping Override',
            user: currentUser.name,
            timestamp: new Date().toISOString(),
            details: `Manual override on ${affectedCourse?.code}: ${changesText}`
          },
          ...evalItem.history
        ]
      };
    }));

    logAction('Match Override Applied', `Updated mapping for course ${courseId} in evaluation ${evaluationId}.`);
    triggerSystemNotification('Course mapping updated', 'success');
  };

  const addComment = (evaluationId: string, commentText: string) => {
    const newComment = {
      id: `comm_${Date.now()}`,
      author: currentUser.name,
      role: currentUser.role,
      text: commentText,
      createdAt: new Date().toISOString()
    };

    setEvaluations(prev => prev.map(e => {
      if (e.id !== evaluationId) return e;
      return {
        ...e,
        comments: [...e.comments, newComment],
        history: [
          {
            id: `h_comm_${Date.now()}`,
            action: 'Comment Added',
            user: currentUser.name,
            timestamp: new Date().toISOString(),
            details: `"${commentText.slice(0, 40)}${commentText.length > 40 ? '...' : ''}"`
          },
          ...e.history
        ]
      };
    }));

    logAction('Comment Appended', `Commented on evaluation ${evaluationId}.`);
  };

  const publishEvaluation = (evaluationId: string, notes?: string) => {
    setEvaluations(prev => prev.map(e => {
      if (e.id !== evaluationId) return e;
      return {
        ...e,
        status: 'published',
        notes: notes || e.notes,
        history: [
          {
            id: `h_pub_${Date.now()}`,
            action: 'Evaluation Published',
            user: currentUser.name,
            timestamp: new Date().toISOString(),
            details: notes || 'Published transfer credits report.'
          },
          ...e.history
        ]
      };
    }));

    // Update lead status
    setLeads(prev => prev.map(l => {
      if (l.evaluationId !== evaluationId) return l;
      return {
        ...l,
        status: 'contacted',
        notes: [...l.notes, `Report published by ${currentUser.name} on ${new Date().toLocaleDateString()}.`]
      };
    }));

    logAction('Evaluation Published', `Published evaluation ${evaluationId}.`);
    triggerSystemNotification('Evaluation report published & student notified', 'success');
  };

  const rejectEvaluation = (evaluationId: string, notes?: string) => {
    setEvaluations(prev => prev.map(e => {
      if (e.id !== evaluationId) return e;
      return {
        ...e,
        status: 'rejected',
        notes: notes || e.notes,
        history: [
          {
            id: `h_rej_${Date.now()}`,
            action: 'Evaluation Rejected',
            user: currentUser.name,
            timestamp: new Date().toISOString(),
            details: notes || 'Rejected transcript evaluation.'
          },
          ...e.history
        ]
      };
    }));

    // Update lead status
    setLeads(prev => prev.map(l => {
      if (l.evaluationId !== evaluationId) return l;
      return {
        ...l,
        status: 'lost',
        notes: [...l.notes, `Evaluation rejected by ${currentUser.name} on ${new Date().toLocaleDateString()}.`]
      };
    }));

    logAction('Evaluation Rejected', `Rejected evaluation ${evaluationId}.`);
    triggerSystemNotification('Evaluation marked as rejected', 'warning');
  };

  const addLead = (lead: Lead) => {
    setLeads(prev => [lead, ...prev]);
    logAction('Lead Created', `Added manual student lead for ${lead.studentName}.`);
  };

  const updateLeadStatus = (leadId: string, status: Lead['status']) => {
    setLeads(prev => prev.map(l => {
      if (l.id !== leadId) return l;
      return {
        ...l,
        status,
        notes: [...l.notes, `Lead pipeline moved to ${status} by ${currentUser.name}.`]
      };
    }));
    logAction('Lead Updated', `Pipeline status for lead ${leadId} changed to ${status}.`);
  };

  const addLeadNote = (leadId: string, note: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id !== leadId) return l;
      return {
        ...l,
        notes: [...l.notes, `${note} - (${currentUser.name})`]
      };
    }));
  };

  const addCatalogCourse = (course: Course) => {
    setReceivingCourses(prev => [course, ...prev]);
    logAction('Catalog Course Added', `Created new baseline course: ${course.code} - ${course.title}.`);
    triggerSystemNotification(`Added ${course.code} to Course Catalog`, 'success');
  };

  const updateCatalogCourse = (course: Course) => {
    setReceivingCourses(prev => prev.map(c => c.id === course.id ? course : c));
    logAction('Catalog Course Updated', `Modified catalog course: ${course.code}.`);
    triggerSystemNotification(`Updated ${course.code} specifications`, 'success');
  };

  const deleteCatalogCourse = (courseId: string) => {
    const course = receivingCourses.find(c => c.id === courseId);
    setReceivingCourses(prev => prev.filter(c => c.id !== courseId));
    logAction('Catalog Course Deleted', `Removed course: ${course?.code || courseId}.`);
    triggerSystemNotification(`Deleted course from catalog`, 'info');
  };

  const addScraperLogEntry = (log: ScraperLog) => {
    setScraperLogs(prev => [log, ...prev]);
    if (log.status === 'success' && log.previewCourses) {
      logAction('Scraper Run Complete', `Successfully extracted ${log.coursesExtractedCount} courses from ${log.url}.`);
      triggerSystemNotification(`Scraping finished. Extracted ${log.coursesExtractedCount} courses!`, 'success');
    } else {
      logAction('Scraper Run Failed', `Scrape attempt failed for URL ${log.url}.`);
      triggerSystemNotification(`Scraping job failed. Check scraper logs.`, 'warning');
    }
  };

  const switchUser = (userId: string) => {
    const foundUser = SYSTEM_USERS.find(u => u.id === userId);
    if (foundUser) {
      setCurrentUser(foundUser);
      triggerSystemNotification(`Logged in as ${foundUser.name}`, 'info');
    }
  };

  const sendMessage = (text: string, attachments?: Array<{ name: string; url: string }>, senderRole: 'student' | 'staff' | 'system' = 'student') => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: senderRole === 'student' ? 'Student User' : 'Admissions Advisor',
      senderRole,
      text,
      timestamp: new Date().toISOString(),
      attachments
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const resetAllData = () => {
    setInstitution(DEFAULT_INSTITUTION);
    setReceivingCourses(RECEIVING_COURSES);
    setEvaluations(INITIAL_EVALUATIONS);
    setLeads(INITIAL_LEADS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setScraperLogs(INITIAL_SCRAPER_LOGS);
    setCurrentUser(SYSTEM_USERS[0]);
    setNotifications([]);
    setMessages([
      {
        id: 'msg_1',
        sender: 'System Admin',
        senderRole: 'system',
        text: 'Welcome to Knot. Your student profile setup is complete. You can now drop transcripts to get credit reports.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      }
    ]);
    localStorage.clear();
    triggerSystemNotification('Application data reset to defaults', 'info');
  };

  return (
    <AppStateContext.Provider value={{
      institution,
      receivingCourses,
      evaluations,
      leads,
      auditLogs,
      scraperLogs,
      systemUsers: SYSTEM_USERS,
      currentUser,
      notifications,
      messages,
      sendMessage,
      onboardCollege,
      updateAIConfig,
      addEvaluation,
      updateExtractedCourse,
      addComment,
      publishEvaluation,
      rejectEvaluation,
      addLead,
      updateLeadStatus,
      addLeadNote,
      addCatalogCourse,
      updateCatalogCourse,
      deleteCatalogCourse,
      addScraperLogEntry,
      triggerSystemNotification,
      clearNotification,
      switchUser,
      logAction,
      resetAllData
    }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};
