const PredictionBadge = ({ item }) => {
  const phLevel = Number(item.phLevel);
  const turbidity = Number(item.turbidity);
  const bacteriaCount = Number(item.bacteriaCount);
  const temperature = Number(item.temperature);

  let status = 'Safe';
  if (phLevel < 6.5 || phLevel > 8.5 || bacteriaCount > 0 || turbidity > 5.0 || temperature > 35) {
    status = 'Unsafe';
  } else if (phLevel < 6.8 || phLevel > 8.2 || turbidity > 4.0 || temperature > 30) {
    status = 'Warning';
  }

  const colorClass = status === 'Safe'
    ? 'bg-emerald-500'
    : status === 'Warning'
    ? 'bg-amber-500'
    : 'bg-red-500';

  return (
    <span className={`px-3 py-1 rounded-full text-white text-xs font-bold ${colorClass}`}>
      {status.toUpperCase()}
    </span>
  );
};

export default PredictionBadge;