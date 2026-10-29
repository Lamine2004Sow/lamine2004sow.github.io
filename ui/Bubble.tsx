'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { rt } from '@/world/runtime';

// Bulle de dialogue du perso. Le texte s'écrit lettre par lettre ;
// Guide.tsx la positionne au-dessus de sa tête à chaque image.
export function Bubble() {
  const bubble = useStore((s) => s.bubble);
  const worldOn = useStore((s) => s.worldOn);
  const classic = useStore((s) => s.classic);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!bubble) return;
    if (rt.reduced) {
      setShown(bubble.text.length);
      return;
    }
    setShown(0);
    const start = performance.now();
    const id = setInterval(() => {
      const n = Math.ceil(((performance.now() - start) / 1000) * 38);
      setShown(Math.min(n, bubble.text.length));
      if (n >= bubble.text.length) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [bubble]);

  const visible = !!bubble && worldOn && !classic;
  return (
    <>
      <div className="bubble" id="bubble" hidden={!visible}>
        <div>{bubble?.text.slice(0, shown)}</div>
        {bubble && bubble.actions.length > 0 && (
          <div className="acts">
            {bubble.actions.map((a) => (
              <button key={a.label} type="button" className={a.primary ? 'btn primary' : 'btn'} onClick={a.run}>
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="sr" aria-live="polite">
        {visible ? bubble.text : ''}
      </p>
    </>
  );
}
