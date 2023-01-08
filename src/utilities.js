export const drawRect = (detections, ctx) => {
  detections.forEach((prediction) => {
    // Get Prediction Result
    const [x, y, width, height] = prediction['bbox']
    const text = prediction['class']

    // Set Styling
    const color = 'green'
    ctx.strokeStyle = color
    ctx.font = '18px Arial'
    ctx.fillStyle = color

    // Draw rectangle and text
    ctx.beginPath()
    ctx.fillText(text, x, y)
    ctx.rect(x, y, width, height)
    ctx.stroke()
  })
}
