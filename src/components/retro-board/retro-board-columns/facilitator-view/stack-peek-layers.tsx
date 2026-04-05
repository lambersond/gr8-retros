const STACK_PEEK_LAYERS = [
  { width: '95%', opacity: 0.7 },
  { width: '90%', opacity: 0.4 },
]

export function StackPeekLayers({ count }: Readonly<{ count: number }>) {
  if (count <= 0) return
  return (
    <div className='flex flex-col items-center mt-0.5'>
      {STACK_PEEK_LAYERS.slice(
        0,
        Math.min(count, STACK_PEEK_LAYERS.length),
      ).map(layer => (
        <div
          key={`${layer.width}-${layer.opacity}`}
          className='h-2 rounded-b-lg bg-card border border-t-0 border-border-light'
          style={{ width: layer.width, opacity: layer.opacity }}
        />
      ))}
    </div>
  )
}
