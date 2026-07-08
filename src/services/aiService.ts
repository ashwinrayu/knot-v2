import { TranscriptEvaluation, ExtractedCourse, Course } from '../types';
import { RECEIVING_COURSES } from './mockData';

// Utility delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface ProgressStep {
  label: string;
  percent: number;
  status: 'idle' | 'running' | 'completed' | 'error';
  detail: string;
}

export const PROCESSING_STEPS: Omit<ProgressStep, 'status' | 'detail'>[] = [
  { label: 'Transcript Uploaded', percent: 5 },
  { label: 'AI Magic Scan', percent: 15 },
  { label: 'Text Segmentation', percent: 30 },
  { label: 'Course Parsing', percent: 45 },
  { label: 'Catalog Lookup', percent: 60 },
  { label: 'AI Magic Mapping', percent: 75 },
  { label: 'Credit & Rule Validation', percent: 85 },
  { label: 'Confidence Score Check', percent: 92 },
  { label: 'Alternative Recommendations', percent: 96 },
  { label: 'Report Generation', percent: 100 }
];

export const simulateAIEvaluation = async (
  studentInfo: {
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    studentProgram: string;
    sendingInstitution: string;
    fileName: string;
  },
  onProgress: (steps: ProgressStep[]) => void
): Promise<TranscriptEvaluation> => {
  // Initialize steps
  const steps: ProgressStep[] = PROCESSING_STEPS.map(s => ({
    ...s,
    status: 'idle',
    detail: 'Waiting to start...'
  }));

  const updateStep = (index: number, status: ProgressStep['status'], detail: string) => {
    steps[index].status = status;
    steps[index].detail = detail;
    // Set previous steps to completed if they aren't already
    for (let i = 0; i < index; i++) {
      if (steps[i].status !== 'completed') {
        steps[i].status = 'completed';
        steps[i].detail = 'Completed successfully.';
      }
    }
    onProgress([...steps]);
  };

  // Step 1: Uploaded
  updateStep(0, 'running', `Uploading file "${studentInfo.fileName}" to institutional AI storage...`);
  await delay(1200);
  updateStep(0, 'completed', `File successfully uploaded (Size: 1.2MB, PDF format).`);

  // Step 2: AI Magic Scan
  updateStep(1, 'running', 'Running AI Magic Scan over transcript pages...');
  await delay(1500);
  updateStep(1, 'completed', 'Scanned all pages with 99.4% precision accuracy.');

  // Step 3: Text Segmentation
  updateStep(2, 'running', 'Segmenting text into headers, semester blocks, grades, and course codes...');
  await delay(1200);
  updateStep(2, 'completed', 'Successfully segmented text. Identified 4 course listings under Fall 2025 and Spring 2026.');

  // Step 4: Course Parsing
  updateStep(3, 'running', 'Parsing course identifiers, credit values, and grades...');
  await delay(1000);
  const parsedCourses = [
    { code: 'CS-101', title: 'Introductory Computing and Python', credits: 4, grade: 'A' },
    { code: 'CS-202', title: 'Data Structures and Java', credits: 4, grade: 'B+' },
    { code: 'MATH-121', title: 'Calculus I', credits: 4, grade: 'C' },
    { code: 'ENG-110', title: 'College Writing and Composition', credits: 3, grade: 'D' }
  ];
  updateStep(3, 'completed', `Parsed: ${parsedCourses.map(c => c.code).join(', ')}.`);

  // Step 5: Catalog Lookup
  updateStep(4, 'running', 'Searching internal Knot University catalog for department matches...');
  await delay(1100);
  updateStep(4, 'completed', 'Found 4 matching departments: Computer Science, Mathematics, Humanities.');

  // Step 6: AI Magic Mapping
  updateStep(5, 'running', 'Performing AI Magic mapping search against course catalog...');
  await delay(1800);
  // Match results calculation
  updateStep(5, 'completed', 'Mapped courses with AI Magic. Highest match: 96% for CS-101.');

  // Step 7: Credit & Rule Validation
  updateStep(6, 'running', 'Verifying grade thresholds (Minimum C) and credit bounds...');
  await delay(1200);
  updateStep(6, 'completed', 'Rule check complete: CS-101, CS-202, MATH-121 passed. ENG-110 has Grade D (below threshold C).');

  // Step 8: Confidence Score Check
  updateStep(7, 'running', 'Aggregating match reliability indices...');
  await delay(1000);
  const avgConfidence = 83.5;
  updateStep(7, 'completed', `Calculated average confidence score of ${avgConfidence}%.`);

  // Step 9: Alternative Recommendations
  updateStep(8, 'running', 'Scanning syllabus for alternative equivalence paths for warnings or low scores...');
  await delay(1100);
  updateStep(8, 'completed', 'No viable alternatives found for ENG-110 (Grade reject). Alternative mapped for CS-202.');

  // Step 10: Report Generation
  updateStep(9, 'running', 'Assembling comprehensive credit transfer matrix PDF report...');
  await delay(1000);
  updateStep(9, 'completed', 'Transfer credit report compiled.');

  // Map parsed items into standard ExtractedCourse format
  const courses: ExtractedCourse[] = [
    {
      id: `ext_sim_${Date.now()}_1`,
      code: 'CS-101',
      title: 'Introductory Computing and Python',
      credits: 4,
      grade: 'A',
      matchedCourseId: 'rec_cs101',
      matchedCourseCode: 'CS 101',
      matchedCourseTitle: 'Introduction to Computer Science',
      receivingCredits: 4,
      confidence: 96,
      status: 'approved',
      reason: 'Course content overlaps by 96%. Covers syntax, functions, simple data collections, and basic object orientation in Python.',
      alternativeSuggestions: []
    },
    {
      id: `ext_sim_${Date.now()}_2`,
      code: 'CS-202',
      title: 'Data Structures and Java',
      credits: 4,
      grade: 'B+',
      matchedCourseId: 'rec_cs102',
      matchedCourseCode: 'CS 102',
      matchedCourseTitle: 'Data Structures & Algorithms',
      receivingCredits: 4,
      confidence: 88,
      status: 'pending',
      reason: '88% match. Syllabus covers abstract data types, lists, recursion, trees, and object-oriented design in Java.',
      alternativeSuggestions: []
    },
    {
      id: `ext_sim_${Date.now()}_3`,
      code: 'MATH-121',
      title: 'Calculus I',
      credits: 4,
      grade: 'C',
      matchedCourseId: 'rec_math101',
      matchedCourseCode: 'MATH 101',
      matchedCourseTitle: 'Calculus I',
      receivingCredits: 4,
      confidence: 92,
      status: 'approved',
      reason: '92% match. Mapped limits, standard differentiation rules, and basic integrals.',
      alternativeSuggestions: []
    },
    {
      id: `ext_sim_${Date.now()}_4`,
      code: 'ENG-110',
      title: 'College Writing and Composition',
      credits: 3,
      grade: 'D',
      matchedCourseId: 'rec_eng101',
      matchedCourseCode: 'ENG 101',
      matchedCourseTitle: 'Academic Writing & Rhetoric',
      receivingCredits: 0,
      confidence: 85,
      status: 'rejected',
      reason: 'The course matches ENG 101 by 85%, but the grade obtained (D) falls below the institutional minimum required grade of C.',
      alternativeSuggestions: []
    }
  ];

  // Auto publish rule: average confidence > 90% and no rejects/pendings
  // Here, avg is 83.5%, and we have a reject and a pending, so status is 'pending_review'
  const finalStatus: TranscriptEvaluation['status'] = 'pending_review';

  const evaluation: TranscriptEvaluation = {
    id: `eval_sim_${Date.now()}`,
    studentName: studentInfo.studentName,
    studentEmail: studentInfo.studentEmail,
    studentPhone: studentInfo.studentPhone,
    studentProgram: studentInfo.studentProgram,
    sendingInstitution: studentInfo.sendingInstitution,
    uploadedAt: new Date().toISOString(),
    status: finalStatus,
    courses,
    confidenceScore: avgConfidence,
    processingTime: '1.8s',
    comments: [
      {
        id: `c_sim_${Date.now()}`,
        author: 'AI Magic Engine',
        role: 'system',
        text: 'AI Magic scan completed. Flagged ENG-110 for manual audit due to grade. Mapped 3 remaining courses.',
        createdAt: new Date().toISOString()
      }
    ],
    history: [
      {
        id: `h_sim_${Date.now()}_1`,
        action: 'Transcript Uploaded',
        user: `${studentInfo.studentName} (Student)`,
        timestamp: new Date().toISOString()
      },
      {
        id: `h_sim_${Date.now()}_2`,
        action: 'AI Evaluation Run',
        user: 'AI Magic Engine',
        timestamp: new Date().toISOString(),
        details: 'Identified 4 courses. Average Match Confidence: 83.5%.'
      }
    ]
  };

  return evaluation;
};

// Simulated scraping tool
export const simulateWebScrape = async (
  url: string,
  onProgress: (log: string) => void
): Promise<Partial<Course>[]> => {
  onProgress(`Connecting to ${url}...`);
  await delay(800);
  onProgress('Bypassing robot.txt protocols (simulated compliance)...');
  await delay(600);
  onProgress('Analyzing webpage DOM structure for course catalog indicators...');
  await delay(1000);
  onProgress('Detected tabular lists of class code definitions...');
  await delay(600);
  onProgress('Extracting titles, descriptions, and prerequisite anchors...');
  await delay(1200);
  onProgress('Scraping completed. Found 3 course specifications.');
  await delay(500);

  // Return scraped course templates
  return [
    {
      code: 'CS-302',
      title: 'Advanced Computer Networks',
      credits: 3,
      department: 'Computer Science',
      description: 'Study of networking protocols, client-server models, network layers, sockets programming, and routing routing models.',
      prerequisites: ['CS 102']
    },
    {
      code: 'MATH-302',
      title: 'Discrete Mathematics',
      credits: 4,
      department: 'Mathematics',
      description: 'Set theory, graphs, logic statements, combinations, functions, and mathematical proofs.',
      prerequisites: ['MATH 101']
    },
    {
      code: 'BUS-310',
      title: 'Global Supply Chain Management',
      credits: 3,
      department: 'Business',
      description: 'Operations strategy, logistics logistics systems, vendor communications, inventory analysis, and global supply logistics.',
      prerequisites: ['BUS 101']
    }
  ];
};
