const cube = document.getElementById("cube");
const scene = document.querySelector(".scene");

      const clickOnSide = (side) => {
        const activeSide = cube.dataset.side;
        cube.classList.replace(`show-${activeSide}`, `show-${side}`);
        cube.setAttribute("data-side", side);
      };

      // Check if target is an interactive element
      const isInteractiveElement = (target) => {
        return target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button');
      };

      // Swipe detection
      const sides = ["front", "right", "back", "left", "top", "bottom"];
      let touchStartX = 0;
      let touchEndX = 0;
      let lastTapTime = 0;
      let lastTapX = 0;
      let lastTapY = 0;

      scene.addEventListener("touchstart", (e) => {
        // Don't interfere with interactive elements
        if (isInteractiveElement(e.target)) {
          return;
        }

        touchStartX = e.changedTouches[0].screenX;
        const currentTapTime = new Date().getTime();
        const tapX = e.changedTouches[0].screenX;
        const tapY = e.changedTouches[0].screenY;
        const tapGap = currentTapTime - lastTapTime;
        const tapDistance = Math.sqrt(Math.pow(tapX - lastTapX, 2) + Math.pow(tapY - lastTapY, 2));

        // Double tap detection
        if (tapGap < 300 && tapDistance < 50) {
          e.preventDefault();
          handleDoubleTap();
        }

        lastTapTime = currentTapTime;
        lastTapX = tapX;
        lastTapY = tapY;
      });

      scene.addEventListener("touchend", (e) => {
        // Don't interfere with interactive elements
        if (isInteractiveElement(e.target)) {
          return;
        }

        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      });

      const handleSwipe = () => {
        const currentSide = cube.dataset.side;
        const currentIndex = sides.indexOf(currentSide);
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0) {
            // Swiped left - go to next side
            const nextIndex = (currentIndex + 1) % sides.length;
            clickOnSide(sides[nextIndex]);
          } else {
            // Swiped right - go to previous side
            const prevIndex = (currentIndex - 1 + sides.length) % sides.length;
            clickOnSide(sides[prevIndex]);
          }
        }
      };

      const handleDoubleTap = () => {
        const currentSide = cube.dataset.side;
        const currentIndex = sides.indexOf(currentSide);
        // Go to next side on double tap
        const nextIndex = (currentIndex + 1) % sides.length;
        clickOnSide(sides[nextIndex]);
      };

      document.querySelectorAll(".btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const sideToTurn = e.target.dataset.side;
          clickOnSide(sideToTurn);
        });
      });