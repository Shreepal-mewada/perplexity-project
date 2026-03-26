import React from "react";

const PremiumFeatureCard = ({
  icon,
  title,
  description,
  buttonText,
  buttonColor,
}) => {
  return (
    <div className="bg-white/3 backdrop-blur-[24px] border border-white/8 rounded-3xl group hover:bg-white/5 transition-all p-8">
      <div
        className={`w-12 h-12 rounded-2xl ${buttonColor}/10 flex items-center justify-center mb-6 border ${buttonColor}/20 group-hover:scale-110 transition-transform`}
      >
        <span
          className={`material-symbols-outlined text-${buttonColor} text-3xl`}
        >
          {icon}
        </span>
      </div>
      <h3 className="text-xl font-bold font-headline mb-3 text-white">
        {title}
      </h3>
      <p className="text-sm text-white/80 mb-8 leading-relaxed">
        {description}
      </p>
      <button
        className={`w-full py-3 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-${buttonColor} hover:text-black hover:border-${buttonColor} transition-all text-white`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default PremiumFeatureCard;
