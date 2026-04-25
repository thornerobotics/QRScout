import { useState, useEffect } from 'preact/hooks';
import { QRModal } from './QR';

interface QueueItem {
  data: string;
  timestamp: string;
  scanned: boolean;
}

export function QueuePage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = () => {
    const savedQueue = JSON.parse(localStorage.getItem('aztech_queue') || '[]');
    setQueue(savedQueue);
  };

  const markAsScanned = (index: number) => {
    const currentQueue = JSON.parse(localStorage.getItem('aztech_queue') || '[]');
    const newQueue = currentQueue.filter((_: any, i: number) => i !== index);
    localStorage.setItem('aztech_queue', JSON.stringify(newQueue));
    setQueue(newQueue);
    setSelectedIndex(null);
  };

  const getDetails = (data: string) => {
    const isPit = data.startsWith('PIT:');
    const rawData = isPit ? data.substring(4) : data;
    const parts = rawData.split('\t');
    
    let teamNumber = 'Unknown';
    if (isPit) {
      teamNumber = parts[0] || 'Unknown';
    } else {
      teamNumber = parts[3] || 'Unknown';
    }

    return {
      type: isPit ? 'Pit' : 'Match',
      team: teamNumber
    };
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 dark:text-white font-rhr-ns">Submission Queue</h2>
      {queue.length === 0 ? (
        <p className="text-gray-500 italic">No entries in the queue.</p>
      ) : (
        <div className="w-full max-w-md grid gap-4 pb-20">
          {queue.map((item, index) => {
            const { type, team } = getDetails(item.data);
            return (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all text-left border-l-4 border-aztechs-orange"
              >
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-widest">
                    {type} Scouting
                  </p>
                  <p className="text-xl font-bold dark:text-white">Team {team}</p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-2xl opacity-20 font-rhr-ns">QR</div>
              </button>
            );
          })}
        </div>
      )}
      
      {selectedIndex !== null && (
        <QRModal 
          show={true} 
          onDismiss={() => setSelectedIndex(null)} 
          qrDataString={queue[selectedIndex].data}
          onMarkAsScanned={() => markAsScanned(selectedIndex)}
        />
      )}
    </div>
  );
}
