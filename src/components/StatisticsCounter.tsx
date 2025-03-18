import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface CounterProps {
  end: number;
  label: string;
  duration?: number;
}

const Counter = ({ end, label, duration = 2.5 }: CounterProps) => {
  const [count, setCount] = React.useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  React.useEffect(() => {
    if (!inView) return;

    const steps = 60; // Updates per second
    const increment = end / (duration * steps);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 1000 / steps);

    return () => clearInterval(timer);
  }, [end, duration, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="text-4xl font-bold text-blue-600 mb-2">{count.toLocaleString()}</div>
      <div className="text-gray-600 font-medium">{label}</div>
    </motion.div>
  );
};

interface StatisticsCounterProps {
  statistics?: {
    states_covered: number;
    outreaches_conducted: number;
    locals_reached: number;
    communities_reached: number;
    souls_won: number;
    rededication_commitments: number;
    medical_beneficiaries: number;
    welfare_beneficiaries: number;
  };
}

const defaultStatistics = {
  states_covered: 15,
  outreaches_conducted: 13,
  locals_reached: 3500,
  communities_reached: 22,
  souls_won: 1200,
  rededication_commitments: 2500,
  medical_beneficiaries: 3000,
  welfare_beneficiaries: 3200,
};

const StatisticsCounter: React.FC<StatisticsCounterProps> = ({ statistics = defaultStatistics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Counter end={statistics.states_covered} label="States Covered" duration={2} />
      <Counter end={statistics.outreaches_conducted} label="Outreaches Conducted" duration={2} />
      <Counter end={statistics.locals_reached} label="Locals Reached" duration={3} />
      <Counter end={statistics.communities_reached} label="Communities Reached" duration={2} />
      <Counter end={statistics.souls_won} label="Souls Won" duration={3} />
      <Counter end={statistics.rededication_commitments} label="Rededication Commitments" duration={3} />
      <Counter end={statistics.medical_beneficiaries} label="Medical Service Beneficiaries" duration={3} />
      <Counter end={statistics.welfare_beneficiaries} label="Welfare Material Beneficiaries" duration={3} />
    </div>
  );
};

export default StatisticsCounter;