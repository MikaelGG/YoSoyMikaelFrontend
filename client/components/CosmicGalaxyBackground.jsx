import { useEffect, useRef } from "react";

/**
 * CosmicGalaxyBackground
 * ----------------------------------------------------
 * High-performance 60fps HTML5 Canvas rendering:
 * 1. Deep Cosmic Void (Black & Deep Blues: #02040A, #03081E)
 * 2. Majestic Blue Nebulae & Ethereal Aurora Clouds (Navy, Sapphire, Cyan)
 * 3. 320+ Ascending Luminous Blue & Diamond Stars with diffraction flares
 * 4. 3D Floating Sacred Geometry & Ascending Yantras:
 *    - Octahedrons (Air / Heart integration)
 *    - Dodecahedrons (Aether / Cosmos)
 *    - Icosahedrons (Water / Consciousness)
 *    - Merkaba Stars (Light Body Vehicle)
 *    - Sri Yantra Pyramids (Ascending Sacred Geometry)
 */

// Golden ratio for Icosahedron & Dodecahedron
const PHI = (1 + Math.sqrt(5)) / 2;
const INV_PHI = 1 / PHI;

// 1. Octahedron (6 vertices, 12 edges, 8 triangular faces)
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
const OCTA_FACES = [
  [0, 2, 4], [0, 4, 3], [0, 3, 5], [0, 5, 2],
  [1, 4, 2], [1, 3, 4], [1, 5, 3], [1, 2, 5]
];

// 2. Merkaba (Star Tetrahedron: 2 interpenetrating regular tetrahedra, 8 vertices, 12 edges)
const S_MERK = 1 / Math.sqrt(3);
const MERK_VERTS = [
  [S_MERK, S_MERK, S_MERK], [-S_MERK, -S_MERK, S_MERK], [-S_MERK, S_MERK, -S_MERK], [S_MERK, -S_MERK, -S_MERK],
  [-S_MERK, -S_MERK, -S_MERK], [S_MERK, S_MERK, -S_MERK], [S_MERK, -S_MERK, S_MERK], [-S_MERK, S_MERK, S_MERK]
];
const MERK_EDGES = [
  [0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 1],
  [4, 5], [4, 6], [4, 7], [5, 6], [6, 7], [7, 5]
];
const MERK_FACES = [
  [0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 3, 2],
  [4, 6, 5], [4, 7, 6], [4, 5, 7], [5, 6, 7]
];

// 3. Icosahedron (12 vertices, 30 edges)
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

// 4. Dodecahedron (20 vertices, 30 edges)
const DOD_RAW = [
  [-1, -1, -1], [-1, -1,  1], [-1,  1, -1], [-1,  1,  1],
  [ 1, -1, -1], [ 1, -1,  1], [ 1,  1, -1], [ 1,  1,  1],
  [ 0, -INV_PHI, -PHI], [ 0, -INV_PHI,  PHI], [ 0,  INV_PHI, -PHI], [ 0,  INV_PHI,  PHI],
  [-INV_PHI, -PHI,  0], [-INV_PHI,  PHI,  0], [ INV_PHI, -PHI,  0], [ INV_PHI,  PHI,  0],
  [-PHI,  0, -INV_PHI], [-PHI,  0,  INV_PHI], [ PHI,  0, -INV_PHI], [ PHI,  0,  INV_PHI]
];
const DOD_VERTS = DOD_RAW.map(v => {
  const len = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / len, v[1] / len, v[2] / len];
});
const DOD_EDGES = [];
for (let i = 0; i < DOD_VERTS.length; i++) {
  for (let j = i + 1; j < DOD_VERTS.length; j++) {
    const d2 = Math.pow(DOD_VERTS[i][0] - DOD_VERTS[j][0], 2) +
               Math.pow(DOD_VERTS[i][1] - DOD_VERTS[j][1], 2) +
               Math.pow(DOD_VERTS[i][2] - DOD_VERTS[j][2], 2);
    if (d2 > 0.45 && d2 < 0.58) {
      DOD_EDGES.push([i, j]);
    }
  }
}

// 5. Sri Yantra Pyramid / Double Sacred Triangle (8 vertices, 18 edges)
const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);
const YANTRA_VERTS = [
  [0, 1, 0], [COS30, -SIN30, 0], [-COS30, -SIN30, 0],  // Shiva triangle (up)
  [0, -1, 0], [-COS30, SIN30, 0], [COS30, SIN30, 0],   // Shakti triangle (down)
  [0, 0, 0.85], [0, 0, -0.85]                           // Dual 3D Meru apices
];
const YANTRA_EDGES = [
  [0, 1], [1, 2], [2, 0],
  [3, 4], [4, 5], [5, 3],
  [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  [7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5]
];
const YANTRA_FACES = [
  [6, 0, 1], [6, 1, 2], [6, 2, 0],
  [7, 3, 4], [7, 4, 5], [7, 5, 3]
];

// Sacred Palettes (Predominantly celestial blues, luminous cyans, sacred whites, mystic violets)
const SHAPE_PALETTES = [
  {
    name: "cyan",
    stroke: "rgba(56, 189, 248, 0.9)",
    glow: "#00f0ff",
    node: "#e0f2fe",
    face: "rgba(14, 165, 233, 0.07)",
    core: "rgba(56, 189, 248, 0.4)"
  },
  {
    name: "white",
    stroke: "rgba(255, 255, 255, 0.95)",
    glow: "#ffffff",
    node: "#ffffff",
    face: "rgba(255, 255, 255, 0.05)",
    core: "rgba(255, 255, 255, 0.5)"
  },
  {
    name: "sapphire",
    stroke: "rgba(96, 165, 250, 0.9)",
    glow: "#3b82f6",
    node: "#bfdbfe",
    face: "rgba(37, 99, 235, 0.07)",
    core: "rgba(59, 130, 246, 0.35)"
  },
  {
    name: "indigo",
    stroke: "rgba(165, 180, 252, 0.85)",
    glow: "#6366f1",
    node: "#c7d2fe",
    face: "rgba(99, 102, 241, 0.06)",
    core: "rgba(99, 102, 241, 0.35)"
  },
  {
    name: "gold",
    stroke: "rgba(253, 224, 71, 0.9)",
    glow: "#facc15",
    node: "#fef08a",
    face: "rgba(234, 179, 8, 0.06)",
    core: "rgba(250, 204, 21, 0.35)"
  }
];

export default function CosmicGalaxyBackground({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    // ----------------------------------------------------
    // 1. Deep Space Cosmic Nebulae (Pure Blue & Indigo aura)
    // ----------------------------------------------------
    const nebulae = [
      { x: width * 0.15, y: height * 0.2, radius: 380, color: "rgba(3, 37, 99, 0.28)", vx: 0.12, vy: -0.06 },
      { x: width * 0.82, y: height * 0.35, radius: 440, color: "rgba(13, 71, 161, 0.24)", vx: -0.09, vy: -0.08 },
      { x: width * 0.4, y: height * 0.65, radius: 390, color: "rgba(2, 20, 60, 0.35)", vx: 0.08, vy: -0.05 },
      { x: width * 0.85, y: height * 0.85, radius: 360, color: "rgba(0, 180, 216, 0.14)", vx: -0.1, vy: -0.07 },
      { x: width * 0.2, y: height * 0.9, radius: 420, color: "rgba(30, 27, 75, 0.3)", vx: 0.06, vy: -0.06 },
    ];

    // ----------------------------------------------------
    // 2. Luminous Blue & Diamond Stars (Ascending cosmic dust)
    // ----------------------------------------------------
    const STAR_COUNT = Math.min(320, Math.max(140, Math.floor((width * height) / 4500)));
    const stars = Array.from({ length: STAR_COUNT }, () => {
      const isBeacon = Math.random() < 0.08;
      const palette = [
        "#00F0FF", // Neon cyan
        "#38BDF8", // Sky blue
        "#60A5FA", // Electric sapphire
        "#FFFFFF", // Diamond white
        "#BAE6FD", // Ice blue
        "#C7D2FE", // Ethereal lavender
      ];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 + 0.3, // depth
        radius: isBeacon ? Math.random() * 1.8 + 1.8 : Math.random() * 1.4 + 0.4,
        isBeacon,
        baseAlpha: Math.random() * 0.6 + 0.4,
        twinkleSpeed: Math.random() * 0.025 + 0.008,
        twinkleOffset: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.25 + 0.15,
        color: palette[Math.floor(Math.random() * palette.length)],
      };
    });

    // ----------------------------------------------------
    // 3. 3D Floating Sacred Geometry / Yantras
    // ----------------------------------------------------
    const SHAPE_TYPES = ["octahedron", "merkaba", "icosahedron", "dodecahedron", "yantra"];
    const GEOM_DEFINITIONS = {
      octahedron: { verts: OCTA_VERTS, edges: OCTA_EDGES, faces: OCTA_FACES, baseRadius: 46 },
      merkaba: { verts: MERK_VERTS, edges: MERK_EDGES, faces: MERK_FACES, baseRadius: 52 },
      icosahedron: { verts: ICO_VERTS, edges: ICO_EDGES, faces: [], baseRadius: 50 },
      dodecahedron: { verts: DOD_VERTS, edges: DOD_EDGES, faces: [], baseRadius: 54 },
      yantra: { verts: YANTRA_VERTS, edges: YANTRA_EDGES, faces: YANTRA_FACES, baseRadius: 48 },
    };

    const SHAPE_COUNT = Math.min(14, Math.max(8, Math.floor(width / 130)));
    const yantras = Array.from({ length: SHAPE_COUNT }, (_, index) => {
      const type = SHAPE_TYPES[index % SHAPE_TYPES.length];
      const palette = SHAPE_PALETTES[Math.floor(Math.random() * SHAPE_PALETTES.length)];
      return {
        type,
        palette,
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 600 + 100, // 3D depth distance
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        dRotX: (Math.random() - 0.5) * 0.016,
        dRotY: (Math.random() - 0.5) * 0.018,
        dRotZ: (Math.random() - 0.5) * 0.014,
        vy: Math.random() * 0.45 + 0.25, // upward speed
        swaySpeed: Math.random() * 0.01 + 0.005,
        swayAmp: Math.random() * 40 + 15,
        swayPhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      };
    });

    let time = 0;
    const FOV = 550; // Camera field of view distance

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // ----------------------------------------------------
      // A. Draw Deep Blue & Indigo Nebulae
      // ----------------------------------------------------
      nebulae.forEach((nebula) => {
        nebula.x += nebula.vx;
        nebula.y += nebula.vy;

        if (nebula.x < -nebula.radius) nebula.x = width + nebula.radius;
        if (nebula.x > width + nebula.radius) nebula.x = -nebula.radius;
        if (nebula.y < -nebula.radius) nebula.y = height + nebula.radius;
        if (nebula.y > height + nebula.radius) nebula.y = -nebula.radius;

        const gradient = ctx.createRadialGradient(
          nebula.x,
          nebula.y,
          nebula.radius * 0.08,
          nebula.x,
          nebula.y,
          nebula.radius
        );
        gradient.addColorStop(0, nebula.color);
        gradient.addColorStop(0.6, nebula.color.replace(/([0-9.]+)\)$/, (m, a) => (parseFloat(a) * 0.4) + ")"));
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // ----------------------------------------------------
      // B. Draw Ascending Luminous Blue Stars & Cosmic Flares
      // ----------------------------------------------------
      stars.forEach((star) => {
        star.y -= star.speed * star.z;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset);
        const alpha = Math.max(0.18, Math.min(1, star.baseAlpha + twinkle * 0.35));

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = star.color;
        ctx.shadowBlur = star.isBeacon ? 14 : star.radius * 3.5;
        ctx.shadowColor = star.color;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * (0.8 + twinkle * 0.25), 0, Math.PI * 2);
        ctx.fill();

        // Beacon 4-point diffraction cross (James Webb style star flare)
        if (star.isBeacon && alpha > 0.6) {
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          const flareLen = star.radius * 4.5 * alpha;
          ctx.moveTo(star.x - flareLen, star.y);
          ctx.lineTo(star.x + flareLen, star.y);
          ctx.moveTo(star.x, star.y - flareLen);
          ctx.lineTo(star.x, star.y + flareLen);
          ctx.stroke();
        }

        ctx.restore();
      });

      // ----------------------------------------------------
      // C. Draw 3D Floating Sacred Geometry & Ascending Yantras
      // ----------------------------------------------------
      // Sort shapes by depth (back-to-front painter algorithm)
      yantras.sort((a, b) => b.z - a.z);

      yantras.forEach((shape) => {
        // Ascending motion
        shape.y -= shape.vy;
        if (shape.y < -130) {
          shape.y = height + 130;
          shape.x = Math.random() * width;
          shape.z = Math.random() * 600 + 100;
        }

        // 3D rotations
        shape.rotX += shape.dRotX;
        shape.rotY += shape.dRotY;
        shape.rotZ += shape.dRotZ;

        // Perspective scale factor
        const scale = FOV / (FOV + shape.z);
        const currentX = shape.x + Math.sin(time * shape.swaySpeed * 60 + shape.swayPhase) * shape.swayAmp * scale;
        const currentY = shape.y;

        const geom = GEOM_DEFINITIONS[shape.type];
        const rad = geom.baseRadius * scale;
        const pulse = Math.sin(time * shape.pulseSpeed * 60) * 0.15 + 0.85;

        // Transform 3D vertices (Rotation + Projection)
        const cosX = Math.cos(shape.rotX), sinX = Math.sin(shape.rotX);
        const cosY = Math.cos(shape.rotY), sinY = Math.sin(shape.rotY);
        const cosZ = Math.cos(shape.rotZ), sinZ = Math.sin(shape.rotZ);

        const projectedVerts = geom.verts.map((v) => {
          const vx = v[0] * rad * pulse;
          const vy = v[1] * rad * pulse;
          const vz = v[2] * rad * pulse;

          // Rot X
          const y1 = vy * cosX - vz * sinX;
          const z1 = vy * sinX + vz * cosX;

          // Rot Y
          const x2 = vx * cosY + z1 * sinY;
          const z2 = -vx * sinY + z1 * cosY;

          // Rot Z
          const x3 = x2 * cosZ - y1 * sinZ;
          const y3 = x2 * sinZ + y1 * cosZ;

          return {
            x: currentX + x3,
            y: currentY + y3,
            z: z2,
          };
        });

        const depthFade = Math.max(0.2, Math.min(0.95, (1 - shape.z / 900) * 1.1));

        ctx.save();
        ctx.globalAlpha = depthFade;

        // 1. Draw Central Glowing Core / Bindu
        const coreGradient = ctx.createRadialGradient(
          currentX,
          currentY,
          1,
          currentX,
          currentY,
          rad * 0.6
        );
        coreGradient.addColorStop(0, shape.palette.core);
        coreGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(currentX, currentY, rad * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // 2. Draw Translucent Faces (if available)
        if (geom.faces && geom.faces.length > 0) {
          ctx.fillStyle = shape.palette.face;
          geom.faces.forEach((f) => {
            const p0 = projectedVerts[f[0]];
            const p1 = projectedVerts[f[1]];
            const p2 = projectedVerts[f[2]];
            if (!p0 || !p1 || !p2) return;

            // Compute normal Z (2D cross product) for subtle lighting
            const nz = (p1.x - p0.x) * (p2.y - p0.y) - (p1.y - p0.y) * (p2.x - p0.x);
            if (nz > 0) {
              ctx.beginPath();
              ctx.moveTo(p0.x, p0.y);
              ctx.lineTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.closePath();
              ctx.fill();
            }
          });
        }

        // 3. Draw Glowing Edges
        ctx.strokeStyle = shape.palette.stroke;
        ctx.lineWidth = Math.max(0.8, 1.4 * scale);
        ctx.shadowBlur = Math.min(16, 9 * scale);
        ctx.shadowColor = shape.palette.glow;

        ctx.beginPath();
        geom.edges.forEach(([i, j]) => {
          const p1 = projectedVerts[i];
          const p2 = projectedVerts[j];
          if (p1 && p2) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        });
        ctx.stroke();

        // 4. Draw Luminous Vertices
        ctx.fillStyle = shape.palette.node;
        projectedVerts.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(1.2, 2.2 * scale), 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Deepest Cosmic Black Base */}
      <div className="absolute inset-0 bg-[#02040a]" />

      {/* 3D Animated Sacred Geometry & Cosmic Starfield */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block opacity-95" />

      {/* Top seamless blend from hero */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#02040a] via-[#02040a]/80 to-transparent pointer-events-none" />

      {/* Bottom seamless blend into footer */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#02040a] via-[#02040a]/85 to-transparent pointer-events-none" />

      {/* Subtle Cosmic Radial Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/20 via-transparent to-[#02040a]/90" />
    </div>
  );
}
