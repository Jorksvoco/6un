Apple Worm Clone — local demo

What's new:
- Improved snake visuals (head + body model styling)
- Gravity: the snake will fall automatically when there's no block underneath its head
- Controls: Arrow keys to move, G toggles gravity, R resets the current level

How to run
1. Open index.html in your browser (double-click or use a simple static server):

   In PowerShell you can run:

   python -m http.server 8000; then open http://localhost:8000

2. Use Arrow keys to move. If the head is over empty space the snake will fall automatically.

Notes / Next ideas
- Improve per-segment physics (falling when any part is unsupported)
- Add sprite assets or image-based models
- Add jump and platform mechanics

Have fun!