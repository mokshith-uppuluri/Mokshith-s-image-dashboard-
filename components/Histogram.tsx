import React, { useMemo } from 'react';
import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';
import { CARD_BG } from '../constants';
import { Activity } from 'lucide-react';

const generateMockData = () => {
    return Array.from({ length: 20 }, (_, i) => ({
        bin: i * 12,
        original: Math.floor(Math.random() * 100),
        blurred: Math.floor(Math.random() * 80)
    }));
};

const Histogram: React.FC = () => {
  const data = useMemo(() => generateMockData(), []);

  return (
    <div className={`p-6 rounded-2xl ${CARD_BG} mt-4`}>
        <div className="flex items-center gap-2 mb-4 text-blue-600">
            <Activity className="w-4 h-4" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">Color Distribution</h3>
        </div>
        <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{fill: 'rgba(0,0,0,0.05)'}}
                    />
                    <Bar dataKey="original" fill="#93c5fd" radius={[2, 2, 0, 0]} opacity={0.8} />
                    <Bar dataKey="blurred" fill="#2563eb" radius={[2, 2, 0, 0]} opacity={0.8} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default Histogram;