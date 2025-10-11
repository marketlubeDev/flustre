import React from "react";

export default function StepSidebar({ steps, currentStep, goToStep }) {
  return (
    <div className="w-full lg:w-[15%] lg:flex-shrink-0 bg-white">
      <div className="lg:sticky lg:top-0 h-full pt-16">
        <div className="space-y-0">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`relative cursor-pointer transition-all duration-200 ${
                currentStep === step.id ? "" : "hover:bg-gray-50"
              }`}
              onClick={() => goToStep(step.id)}
            >
              <div className="px-6 py-4">
                {currentStep === step.id && (
                  <span
                    aria-hidden
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                    style={{
                      width: "3px",
                      height: "35px",
                      backgroundColor: "#6D0D26",
                      borderTopLeftRadius: "8px",
                      borderBottomLeftRadius: "8px",
                    }}
                  />
                )}
                <div className="flex items-center">
                  <span
                    className={`text-xs font-medium mr-3 ${
                      currentStep === step.id
                        ? "text-[#00000066]"
                        : "text-[#00000066]"
                    }`}
                    style={currentStep === step.id ? { color: "#6D0D26" } : {}}
                  >
                    Step {step.id}/{steps.length}
                  </span>
                </div>
                <h3
                  className={`text-sm font-semibold mt-1`}
                  style={{
                    color: currentStep === step.id ? "#000000" : "#000000CC",
                  }}
                >
                  {step.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
