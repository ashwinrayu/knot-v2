import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { Card } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { Link } from 'react-router-dom';
import { FileText, Eye, CheckCircle2, Clock } from 'lucide-react';

export const StudentEvaluations: React.FC = () => {
  const { user } = useAuth();
  const { evaluations } = useAppState();

  const studentEvaluations = evaluations.filter(e => 
    e.studentName.toLowerCase().includes(user?.name.toLowerCase() || '')
  );

  const columns = [
    {
      key: 'id',
      header: 'Evaluation ID',
      render: (row: any) => <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">{row.id.substring(0, 8)}</span>
    },
    {
      key: 'sendingInstitution',
      header: 'Origin College',
      sortable: true
    },
    {
      key: 'studentProgram',
      header: 'Target Program',
      sortable: true
    },
    {
      key: 'uploadedAt',
      header: 'Scanned Date',
      render: (row: any) => new Date(row.uploadedAt).toLocaleDateString(),
      sortable: true
    },
    {
      key: 'confidenceScore',
      header: 'AI Confidence',
      render: (row: any) => (
        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border font-bold">
          {row.confidenceScore}%
        </span>
      ),
      sortable: true
    },
    {
      key: 'status',
      header: 'Mapping Status',
      render: (row: any) => (
        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
          row.status === 'published' ? 'bg-emerald-50 text-emerald-700' :
          row.status === 'rejected' ? 'bg-rose-50 text-rose-700' :
          'bg-amber-50 text-amber-700'
        }`}>
          {row.status.replace('_', ' ')}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: any) => (
        <Link 
          to={`/student/evaluations/${row.id}`} 
          className="p-1 border rounded-lg hover:bg-slate-50 text-slate-500 hover:text-indigo-650 flex items-center justify-center gap-1 bg-white select-none shadow-xs font-bold text-[9px] w-18"
        >
          <Eye className="h-3.5 w-3.5" />
          Details
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6 font-sans text-xs">
      
      <div className="border-b pb-5 select-none">
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">My Evaluations History</h1>
        <p className="text-xs text-slate-400 mt-1">Review catalog mapping results and admissions reviewer decisions status.</p>
      </div>

      {studentEvaluations.length === 0 ? (
        <Card className="p-16 text-center text-slate-400 space-y-4">
          <FileText className="h-10 w-10 mx-auto text-slate-200" />
          <p className="text-sm font-semibold text-slate-655">No evaluations logged</p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-normal">
            Upload your college transcript to initialize the AI catalog equivalence search.
          </p>
          <Link to="/student/upload" className="inline-block px-4 py-2 bg-indigo-650 text-white rounded-xl text-xs font-semibold shadow-md select-none">
            Start Free Upload
          </Link>
        </Card>
      ) : (
        <DataTable
          data={studentEvaluations}
          columns={columns}
          searchKey="sendingInstitution"
          searchPlaceholder="Filter by origin college..."
          csvFilename="my_evaluations_archive.csv"
        />
      )}

    </div>
  );
};
export { StudentEvaluations as default };
