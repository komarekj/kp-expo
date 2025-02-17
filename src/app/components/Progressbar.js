export default function Progressbar({ finished, total}) {
  const progress = finished / total * 100;
  const left = total - finished;

  let info;
  let label;

  if (left === 0) {
    label = 'All Coupons Used!';
    info = 'You have unlocked a reward!';
  } else {
    label = `${finished} of ${total} Coupons Used`;
    info = `Use ${left} More Coupons To Unlock A Reward!`; 
  }

  return (
    <div className="bg-white shadow-sm p-2 fixed bottom-0 left-0 right-0 z-40">
      <div className="bg-gray-800 text-white text-sm text-center py-1.5 px-4 rounded-3xl mb-2 relative">
        <div className="absolute left-0 top-0 right-0 bottom-0 p-0.5">
          <div className="bg-orange rounded-3xl h-full" style={{width: `${progress}%`}}></div>
        </div>
        <div className="relative z-10 leading-none">{label}</div>
      </div>
      <p className="text-center text-xs text-gray-800">{info}</p>
    </div>
  );
}