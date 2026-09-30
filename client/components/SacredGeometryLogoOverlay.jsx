import React, { useEffect, useRef } from "react";

/**
 * SacredGeometryLogoOverlay
 * ----------------------------------------------------
 * Transparent canvas rendering 3D Sacred Geometry over the hero background:
 * - 3D Wireframe Merkaba (Star Tetrahedron)
 * - 3D Octahedron & Icosahedron
 * - Sacred Concentric Golden Ratio Rings
 * - Floating Starlight Nodes
 * Integrated directly as if part of the background logo.
 */

const PHI = (1 + Math.sqrt(5)) / 2;

// 1. Octahedron
const OCTA_VERTS = [
  [0, 1, 0], [0, -1, 0],
  [1, 0, 0], [-1, 0, 0],
  [0, 0, 1], [0, 0, -1]
];
const OCTA_EDGES = [
  [0, 2], [0, 3], [0, 4], [0, 5],
  [1, 2], [1, 3], [1, 4], [1, 5],
  [2, 4], [4, 3], [3, 5], [5, 2]
];

// 2. Merkaba (Star Tetrahedron)
const S_MERK = 1 / Math.sqrt(3);
const MERK_VERTS = [
  [S_MERK, S_MERK, S_MERK], [-S_MERK, -S_MERK, S_MERK], [-S_MERK, S_MERK, -S_MERK], [S_MERK, -S_MERK, -S_MERK],
  [-S_MERK, -S_MERK, -S_MERK], [S_MERK, S_MERK, -S_MERK], [S_MERK, -S_MERK, S_MERK], [-S_MERK, S_MERK, S_MERK]
];
const MERK_EDGES = [
  [0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 1],
  [4, 5], [4, 6], [4, 7], [5, 6], [6, 7], [7, 5]
];

// 3. Icosahedron
const R_ICO = Math.sqrt(1 + PHI * PHI);
const T_ICO = PHI / R_ICO;
const U_ICO = 1 / R_ICO;
const ICO_VERTS = [
  [-U_ICO,  T_ICO,  0], [ U_ICO,  T_ICO,  0], [-U_ICO, -T_ICO,  0], [ U_ICO, -T_ICO,  0],
  [ 0, -U_ICO,  T_ICO], [ 0,  U_ICO,  T_ICO], [ 0, -U_ICO, -T_ICO], [ 0,  U_ICO, -T_ICO],
  [ T_ICO,  0, -U_ICO], [ T_ICO,  0,  U_ICO], [-T_ICO,  0, -U_ICO], [-T_ICO,  0,  U_ICO]
];
const ICO_EDGES = [];
for (let i = 0; i < ICO_VERTS.length; i++) {
  for (let j = i + 1; j < ICO_VERTS.length; j++) {
    const d2 = Math.pow(ICO_VERTS[i][0] - ICO_VERTS[j][0], 2) +
               Math.pow(ICO_VERTS[i][1] - ICO_VERTS[j][1], 2) +
               Math.pow(ICO_VERTS[i][2] - ICO_VERTS[j][2], 2);
    if (Math.abs(d2 - Math.pow(2 * U_ICO, 2)) < 0.06) {
      ICO_EDGES.push([i, j]);
    }
  }
}

export default function SacredGeometryLogoOverlay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Geometry instances floating around the logo / header area
    const shapes = [
      // Central Sacred Merkaba (aligned with background logo)
      {
        type: "merkaba",
        x: width * 0.5,
        y: height * 0.28,
        radius: 95,
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        speedX: 0.003,
        speedY: 0.005,
        speedZ: 0.002,
        color: "rgba(147, 197, 253, 0.45)", // Celestial Blue
        glow: "rgba(59, 130, 246, 0.35)",
        baseY: height * 0.28,
        floatFreq: 0.0015
      },
      // Left Ascending Octahedron
      {
        type: "octa",
        x: width * 0.22,
        y: height * 0.35,
        radius: 55,
        rotX: 0.5,
        rotY: 0,
        rotZ: 0,
        speedX: 0.004,
        speedY: 0.006,
        speedZ: 0.003,
        color: "rgba(252, 211, 77, 0.4)", // Solar Gold
        glow: "rgba(245, 158, 11, 0.3)",
        baseY: height * 0.35,
        floatFreq: 0.0018
      },
      // Right Ascending Icosahedron
      {
        type: "icosa",
        x: width * 0.78,
        y: height * 0.33,
        radius: 65,
        rotX: 0,
        rotY: 0.8,
        rotZ: 0,
        speedX: 0.003,
        speedY: 0.004,
        speedZ: 0.005,
        color: "rgba(196, 181, 253, 0.4)", // Violet-Silver
        glow: "rgba(168, 85, 247, 0.3)",
        baseY: height * 0.33,
        floatFreq: 0.0013
      }
    ];

    // Background starlight particles
    const stars = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.8,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.02 + 0.005
    }));

    let t = 0;

    const render = () => {
      t += 1;
      // Clean frame (TRANSPARENT - never hides the background image!)
      ctx.clearRect(0, 0, width, height);

      // Reposition shapes on resize
      shapes[0].x = width * 0.5;
      shapes[0].y = shapes[0].baseY + Math.sin(t * shapes[0].floatFreq) * 12;
      shapes[1].x = Math.max(width * 0.18, 90);
      shapes[1].y = shapes[1].baseY + Math.cos(t * shapes[1].floatFreq) * 10;
      shapes[2].x = Math.min(width * 0.82, width - 90);
      shapes[2].y = shapes[2].baseY + Math.sin(t * shapes[2].floatFreq + 1) * 10;

      // 1. Draw subtle concentric sacred geometry rings behind the central logo
      const cx = shapes[0].x;
      const cy = shapes[0].y;
      ctx.save();
      ctx.lineWidth = 1;

      // Outer golden ratio ring
      ctx.strokeStyle = "rgba(252, 211, 77, 0.18)";
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.stroke();

      // Middle cyan ring with dashed sacred alignment
      ctx.setLineDash([4, 8]);
      ctx.strokeStyle = "rgba(147, 197, 253, 0.22)";
      ctx.beginPath();
      ctx.arc(cx, cy, 110, t * 0.003, t * 0.003 + Math.PI * 2);
      ctx.stroke();

      // Inner ring
      ctx.setLineDash([2, 4]);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
      ctx.beginPath();
      ctx.arc(cx, cy, 75, -t * 0.004, -t * 0.004 + Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 2. Draw floating starlight dust
      stars.forEach((star) => {
        star.alpha += Math.sin(t * star.speed) * 0.01;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(0.8, star.alpha))})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Render 3D Sacred Geometry Shapes
      shapes.forEach((shape) => {
        shape.rotX += shape.speedX;
        shape.rotY += shape.speedY;
        shape.rotZ += shape.speedZ;

        let verts = [];
        let edges = [];

        if (shape.type === "octa") {
          verts = OCTA_VERTS;
          edges = OCTA_EDGES;
        } else if (shape.type === "merkaba") {
          verts = MERK_VERTS;
          edges = MERK_EDGES;
        } else if (shape.type === "icosa") {
          verts = ICO_VERTS;
          edges = ICO_EDGES;
        }

        // 3D rotation matrix calculation
        const cosX = Math.cos(shape.rotX), sinX = Math.sin(shape.rotX);
        const cosY = Math.cos(shape.rotY), sinY = Math.sin(shape.rotY);
        const cosZ = Math.cos(shape.rotZ), sinZ = Math.sin(shape.rotZ);

        const projected = verts.map(([vx, vy, vz]) => {
          // Rotate Y
          let x1 = vx * cosY + vz * sinY;
          let y1 = vy;
          let z1 = -vx * sinY + vz * cosY;

          // Rotate X
          let x2 = x1;
          let y2 = y1 * cosX - z1 * sinX;
          let z2 = y1 * sinX + z1 * cosX;

          // Rotate Z
          let x3 = x2 * cosZ - y2 * sinZ;
          let y3 = x2 * sinZ + y2 * cosZ;
          let z3 = z2;

          // Perspective projection
          const fov = 350;
          const p = fov / (fov + z3 * shape.radius);

          return {
            px: shape.x + x3 * shape.radius * p,
            py: shape.y + y3 * shape.radius * p,
            pz: z3
          };
        });

        // Draw edges
        ctx.save();
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = 1.25;
        ctx.shadowColor = shape.glow;
        ctx.shadowBlur = 10;

        edges.forEach(([i1, i2]) => {
          const v1 = projected[i1];
          const v2 = projected[i2];
          ctx.beginPath();
          ctx.moveTo(v1.px, v1.py);
          ctx.lineTo(v2.px, v2.py);
          ctx.stroke();
        });

        // Draw glowing vertex points
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        projected.forEach((pt) => {
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, 1.8, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
