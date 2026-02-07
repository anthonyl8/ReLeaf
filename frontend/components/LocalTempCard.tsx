
import React, { useEffect, useState } from 'react';
import { getTemperature } from '../api';

const chartData = [40, 60, 50, 80, 100, 70];

const VANCOUVER_LAT = 49.2827;
const VANCOUVER_LON = -123.1207;

const LocalTempCard: React.FC = () => {
    const [temp, setTemp] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTemperature(VANCOUVER_LAT, VANCOUVER_LON)
            .then((r) => { setTemp(r.temperature_c); setLoading(false); })
            .catch(() => { setLoading(false); });
    }, []);

    return (
        <div className="pointer-events-auto mt-auto glass-panel rounded-xl border border-[#28392c] p-5 shadow-xl w-64 animate-fade-in-up">
            <div className="flex items-start justify-between mb-2">
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Local Temp</span>
                    <span className="text-[10px] text-gray-500">Satellite-derived</span>
                </div>
                <span className="material-symbols-outlined text-orange-500 text-[24px]">device_thermostat</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white tracking-tight">
                    {loading ? '—' : temp != null ? temp.toFixed(1) : '—'}
                </span>
                <span className="text-xl text-gray-400 font-medium">°C</span>
            </div>
            <div className="mt-4 flex items-end gap-1 h-8">
                {chartData.map((height, index) => (
                    <div key={index} className="w-1/6 bg-orange-500 rounded-sm" style={{ height: `${height}%`, opacity: height/100 * 0.8 + 0.2 }}>
                        {height === 100 && (
                            <div className="relative group cursor-help w-full h-full">
                                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-[10px] p-1 rounded whitespace-nowrap">
                                    Peak
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-1 text-[10px] text-center text-gray-500 w-full">Past 6 Hours</div>
        </div>
    );
};

export default LocalTempCard;
