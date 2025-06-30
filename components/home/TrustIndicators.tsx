export default function TrustIndicators() {
  const indicators = [
    { value: '15+', label: 'Years Experience' },
    { value: '3', label: 'PE Exits Survived' },
    { value: '50', label: 'Client Limit' },
    { value: '100%', label: 'Personal Service' },
  ]

  return (
    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
      {indicators.map((indicator, index) => (
        <div
          key={index}
          className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
        >
          <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-2">
            {indicator.value}
          </div>
          <div className="text-sm text-gray-400">{indicator.label}</div>
        </div>
      ))}
    </div>
  )
} 