let mouseX = 0,
  mouseY = 0,
  delayX = 0,
  delayY = 0;
const delayAmount = 0.1; // Ajustez cette valeur pour changer la quantité de délai

const tracker = document.querySelector("#mouse-tracker");

document.addEventListener("mousemove", (e) => {
  mouseX = e.pageX;
  mouseY = e.pageY;
});

function animate() {
  delayX += (mouseX - delayX) * delayAmount;
  delayY += (mouseY - delayY) * delayAmount;

  tracker.style.left = delayX + "px";
  tracker.style.top = delayY + "px";

  requestAnimationFrame(animate);
}

animate();
