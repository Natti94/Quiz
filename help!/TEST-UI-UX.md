This file documents manual tests for UI components.

Auth Modal Manual Test
1. Open the app in a browser at http://localhost:5173 (or Netlify Dev URL at http://localhost:8888).
2. Click Log in / Register in the header to open the modal.
3. Confirm the modal header (title), auth form, and footer are visible simultaneously without the modal itself scrolling.
   - If the viewport is small, the inputs may stack but the header and footer should still remain visible.
    - If the viewport is small, the inputs may stack but the header and footer should still remain visible.
   4. Verify there are no duplicate login/register buttons:
      - The only triggers are the two buttons in the header. The modal no longer shows a separate toggle in the header—use the footer button to switch between Log in and Register.
   5. Confirm there is no horizontal scroll on the page (no left-right scrollbar). If you still see it, check the nav or big wide elements and report the specific screen/viewport.
4. Use both login and register to verify forms update the contents properly.
5. Keyboard accessibility:
   - TAB through inputs and buttons; focus should be visible.
   - Press ESC to dismiss (if implemented) or click the × to close.

Notes:
- If the auth form content requires more height than the viewport, only the form area may scroll; the header and footer stay pinned. This is by design to ensure quick access to close or toggle pages.
 - The header will remain visible and interactive when modals are open. Horizontal overflow is hidden globally to avoid spurious x-scroll.
