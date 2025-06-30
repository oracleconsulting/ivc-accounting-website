export default function TrustIndicators() {
  const indicators = [
    { value: '15+', label: 'Years Experience' },
    { value: '1', label: 'PE Exit (By Choice)' },
    { value: '50', label: 'Client Limit' },
    { value: '100%', label: 'Personal Service' },
  ]

  return (
    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
      {indicators.map((indicator, index) => (
        <div
          key={index}
          className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-colors"
        >
          <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
            {indicator.value}
          </div>
          <div className="text-sm text-gray-100">{indicator.label}</div>
        </div>
      ))}
    </div>
  )
} 