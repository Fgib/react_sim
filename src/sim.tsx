import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PauseIcon, PlayIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { ScrollArea } from "./components/ui/scroll-area";

// const G = 6.67430e-11 * 1e6;
const G = 6.67430e-11 / 1e6;
// const G = 6.67430e-11;

interface Vec2 {
  x: number;
  y: number;
}

interface Body {
  position: Vec2;
  velocity: Vec2;
  mass: number;
  size: number;
}

// Update Prediction type
type Prediction = {
  positions: Vec2[][];
};

function Sim() {
  // Add new state for selected body
  const [selectedBodyIndex, setSelectedBodyIndex] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [prediction, setPrediction] = useState<Prediction>({ positions: [] });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const simulationBodiesRef = useRef<Body[]>([]);
  const [zoom, setZoom] = useState(0.20);
  const [showPredictions, setShowPredictions] = useState(true);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsPanning(true);
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPanning) return;

    const dx = e.clientX - lastMousePosition.current.x;
    const dy = e.clientY - lastMousePosition.current.y;

    setPanOffset(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));

    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    // e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.min(Math.max(prev * zoomFactor, 0.1), 10)); // Limit zoom between 0.1x and 10x
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert click coordinates to world space
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - canvas.width / 2 - panOffset.x) / zoom;
    const clickY = (e.clientY - rect.top - canvas.height / 2 - panOffset.y) / zoom;

    // Check if click is on any body
    const bodyPositions = isPlaying ? simulationBodiesRef.current : bodies.map(b => ({ position: { x: b.positionX, y: b.positionY }, size: b.size }));

    for (let i = 0; i < bodyPositions.length; i++) {
      const body = bodyPositions[i];
      const dx = body.position.x - clickX;
      const dy = body.position.y - clickY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < body.size / zoom) {
        setSelectedBodyIndex(prevIndex => prevIndex === i ? null : i);
        return;
      }
    }

    setSelectedBodyIndex(null);
  };

  const [fps, setFps] = useState(0);
  const fpsRef = useRef({ frames: 0, lastTime: performance.now() });
  const [bodies, setBodies] = useState([
    { // Sun
      mass: 1.989e24,
      velocityX: 0,
      velocityY: 0,
      positionX: 0,
      positionY: 0,
      color: "yellow",
      size: 20
    },
    { // Mercury
      mass: 3.285e17,
      velocityX: 0,
      velocityY: 553,
      positionX: 390,
      positionY: 0,
      color: "gray",
      size: 4
    },
    { // Venus
      mass: 4.867e18,
      velocityX: 0,
      velocityY: 404,
      positionX: 720,
      positionY: 0,
      color: "orange",
      size: 5
    },
    { // Earth
      mass: 5.972e18,
      velocityX: 0,
      velocityY: 344,
      positionX: 1000,
      positionY: 0,
      color: "blue",
      size: 5
    },
    { // The moon
      mass: 7.347e16,
      velocityX: 0,
      velocityY: 344,
      positionX: 1000,
      positionY: 3,
      color: "gray",
      size: 3
    },
    { // Mars
      mass: 6.39e17,
      velocityX: 0,
      velocityY: 270,
      positionX: 1520,
      positionY: 0,
      color: "red",
      size: 5
    },
    { // Jupiter
      mass: 1.898e21,
      velocityX: 0,
      velocityY: -257,
      positionX: -2000,
      positionY: 0,
      color: "orange",
      size: 10
    },
    { // Saturn
      mass: 5.683e20,
      velocityX: 0,
      velocityY: 241,
      positionX: 2300,
      positionY: 0,
      color: "yellow",
      size: 9
    },
    // { // Uranus
    //   mass: 8.681e18,
    //   velocityX: 0,
    //   velocityY: 70,
    //   positionX: 2600,
    //   positionY: 0,
    //   color: "blue",
    // },
    // { // Neptune
    //   mass: 1.024e19,
    //   velocityX: 0,
    //   velocityY: 50,
    //   positionX: 2900,
    //   positionY: 0,
    //   color: "blue",
    // },
  ]);

  useEffect(() => {
    simulationBodiesRef.current = bodies.map(body => ({
      position: { x: body.positionX, y: body.positionY },
      velocity: { x: body.velocityX, y: body.velocityY },
      mass: body.mass,
      size: body.size,
    }));
  }, [bodies]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Make canvas responsive while maintaining aspect ratio
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      const width = container.clientWidth;
      canvas.width = width;
      canvas.height = width * (14 / 19);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const update = (dt: number) => {
      const simBodies = simulationBodiesRef.current;

      // Calculate forces between all pairs of bodies
      for (let i = 0; i < simBodies.length; i++) {
        for (let j = i + 1; j < simBodies.length; j++) {
          const body1 = simBodies[i];
          const body2 = simBodies[j];

          const dx = body2.position.x - body1.position.x;
          const dy = body2.position.y - body1.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 10) continue;

          const force = (G * body1.mass * body2.mass) / (distance * distance);
          const fx = (force * dx) / distance;
          const fy = (force * dy) / distance;

          body1.velocity.x += (fx / body1.mass) * dt;
          body1.velocity.y += (fy / body1.mass) * dt;
          body2.velocity.x -= (fx / body2.mass) * dt;
          body2.velocity.y -= (fy / body2.mass) * dt;
        }
      }

      // Update positions
      simBodies.forEach(body => {
        body.position.x += body.velocity.x * dt;
        body.position.y += body.velocity.y * dt;
      });
    };

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();

      // Calculate center position based on selected body
      let centerX = 0;
      let centerY = 0;

      if (selectedBodyIndex !== null) {
        if (isPlaying) {
          centerX = simulationBodiesRef.current[selectedBodyIndex].position.x;
          centerY = simulationBodiesRef.current[selectedBodyIndex].position.y;
        } else {
          centerX = bodies[selectedBodyIndex].positionX;
          centerY = bodies[selectedBodyIndex].positionY;
        }
      }

      ctx.translate(
        canvas.width / 2 + panOffset.x - (centerX * zoom),
        canvas.height / 2 + panOffset.y - (centerY * zoom)
      );
      ctx.scale(zoom, zoom);

      // Draw predictions if enabled
      if (showPredictions) {
        prediction.positions.forEach((bodyPositions, index) => {
          ctx.strokeStyle = `${bodies[index].color}`;
          ctx.lineWidth = 1 / zoom;
          ctx.beginPath();
          bodyPositions.forEach((pos, i) => {
            if (i === 0) ctx.moveTo(pos.x, pos.y);
            else ctx.lineTo(pos.x, pos.y);
          });
          ctx.stroke();
        });
      }

      // Draw current body positions
      bodies.forEach((body, index) => {
        ctx.fillStyle = bodies[index].color;
        ctx.beginPath();
        const pos = isPlaying
          ? simulationBodiesRef.current[index].position
          : { x: body.positionX, y: body.positionY };

        ctx.arc(pos.x, pos.y, body.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw selection indicator
        if (index === selectedBodyIndex) {
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 2 / zoom;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Restore the canvas context
      ctx.restore();
    };

    const updateFPS = () => {
      const now = performance.now();
      fpsRef.current.frames++;

      if (now - fpsRef.current.lastTime >= 1000) {
        setFps(Math.round(fpsRef.current.frames * 1000 / (now - fpsRef.current.lastTime)));
        fpsRef.current.frames = 0;
        fpsRef.current.lastTime = now;
      }
    };

    const loop = (prevTime: number) => {
      const now = performance.now();
      const dt = (now - prevTime) / 1000; // Convert ms to seconds
      update(dt);
      draw();
      updateFPS();
      animationRef.current = requestAnimationFrame(() => loop(now));
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(() => loop(performance.now()));
    } else {
      // Just draw once for preview
      draw();
    }

    const cleanup = () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    return cleanup;
  }, [bodies, isPlaying, prediction, panOffset, zoom, showPredictions, selectedBodyIndex]);

  // Separate useEffect for prediction updates
  useEffect(() => {
    const simulationBodies: Body[] = bodies.map(body => ({
      position: { x: body.positionX, y: body.positionY },
      velocity: { x: body.velocityX, y: body.velocityY },
      mass: body.mass,
      size: body.size,
    }));

    const newPrediction = predictTrajectories(simulationBodies);
    setPrediction(newPrediction);
  }, [bodies]);

  const predictTrajectories = (initialBodies: Body[], steps: number = 5000) => {
    console.time("Trajectories prediction");
    const simBodies = initialBodies.map(body => ({ ...body }));
    const predictions: Vec2[][] = simBodies.map(() => []);
    const samplingRate = 1;
    const dt = 1 / 60; // Match the typical frame time of 60fps

    for (let step = 0; step < steps; step++) {
      // Calculate forces between all pairs of bodies - exactly like in simulation
      for (let i = 0; i < simBodies.length; i++) {
        for (let j = i + 1; j < simBodies.length; j++) {
          const body1 = simBodies[i];
          const body2 = simBodies[j];

          const dx = body2.position.x - body1.position.x;
          const dy = body2.position.y - body1.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 10) continue;

          const force = (G * body1.mass * body2.mass) / (distance * distance);
          const fx = (force * dx) / distance;
          const fy = (force * dy) / distance;

          // Use the same dt as simulation
          body1.velocity.x += (fx / body1.mass) * dt;
          body1.velocity.y += (fy / body1.mass) * dt;
          body2.velocity.x -= (fx / body2.mass) * dt;
          body2.velocity.y -= (fy / body2.mass) * dt;
        }
      }

      // Update positions using the same dt
      simBodies.forEach((body, index) => {
        body.position.x += body.velocity.x * dt;
        body.position.y += body.velocity.y * dt;
        if (step % samplingRate === 0) {
          predictions[index].push({ x: body.position.x, y: body.position.y });
        }
      });
    }

    console.timeEnd("Trajectories prediction");
    return { positions: predictions };
  };

  const toggleSimulation = () => {
    setIsPlaying(!isPlaying);
  };

  const addBody = () => {
    setBodies([
      ...bodies,
      {
        mass: 300000,
        velocityX: Math.random() * 20 - 10,
        velocityY: Math.random() * 20 - 10,
        positionX: Math.random() * 600,
        positionY: Math.random() * 400,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        size: 5
      },
    ]);
  };

  const removeBody = (index: number) => {
    setBodies(bodies.filter((_, i) => i !== index));
  };

  function spawnAsteroidBelt() {
    const newBodies = [...bodies];
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const radius = 1520 + Math.random() * 480; // between Mars (~1520) and Jupiter (~2000)

      // Calculate orbital velocity based on radius (simplified circular orbit)
      // v = sqrt(GM/r) where G is gravitational constant, M is Sun's mass, r is radius
      const sunMass = bodies[0].mass; // assuming first body is the Sun
      const orbitalSpeed = Math.sqrt((G * sunMass) / radius);

      // Convert orbital speed to x and y components
      // Velocity should be perpendicular to the radius vector
      const velocityX = orbitalSpeed * Math.sin(angle);
      const velocityY = -orbitalSpeed * Math.cos(angle);

      const randomMass = 1e15 + Math.random() * 5e16;
      const velocityJitterX = (Math.random() - 0.5) * 20;
      const velocityJitterY = (Math.random() - 0.5) * 20;

      newBodies.push({
        mass: randomMass,
        velocityX: velocityX + velocityJitterX,
        velocityY: velocityY + velocityJitterY,
        positionX: radius * Math.cos(angle),
        positionY: radius * Math.sin(angle),
        color: "gray",
        size: 1 + Math.random() * 3
      });
    }
    setBodies(newBodies);
  }

  return (
    <div className="p-4 flex flex-col md:flex-row gap-4 bg-slate-200 min-w-[1400px] rounded-xl">
      <div className="w-full md:w-2/3">
        <div className="relative w-full">
          <canvas
            ref={canvasRef}
            className="w-full bg-black cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onClick={handleCanvasClick}  // Add click handler
          />
          <div className="absolute top-2 left-2 text-white bg-black/50 px-2 py-1 rounded">
            {isPlaying ? `${fps} FPS` : 'Paused'} | Zoom: {Math.round(zoom * 100)}%
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            <Button variant="secondary" size="icon" onClick={() => setShowPredictions(prev => !prev)}>
              {showPredictions ? "🔭" : "👁️"}
            </Button>
            <Button variant="secondary" size="icon" onClick={toggleSimulation}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </Button>
          </div>
        </div>
      </div>

      <Card className="p-4 space-y-4 min-w-[500px] w-full md:w-1/3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Bodies</h2>
          <Button onClick={addBody} variant="outline">
            Add celestial body
            <PlusCircleIcon className="h-4 w-4" />
          </Button>
          <Button onClick={spawnAsteroidBelt} variant="outline">
            Add asteroid belt
            <PlusCircleIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-6">
          <ScrollArea className="h-[570px] rounded-md border ">
            {bodies.map((body, index) => (
              <div key={index} className="space-y-4 relative border p-4 m-4 rounded-lg" style={{ borderColor: body.color }}>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">Body {index + 1}</h3>
                  {bodies.length > 2 && (
                    <Button variant="ghost" size="icon" onClick={() => removeBody(index)}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Velocity X</Label>
                    <Input
                      type="number"
                      value={body.velocityX}
                      onChange={(e) => {
                        const newBodies = [...bodies];
                        newBodies[index].velocityX = Number(e.target.value);
                        setBodies(newBodies);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Velocity Y</Label>
                    <Input
                      type="number"
                      value={body.velocityY}
                      onChange={(e) => {
                        const newBodies = [...bodies];
                        newBodies[index].velocityY = Number(e.target.value);
                        setBodies(newBodies);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Position X</Label>
                    <Input
                      type="number"
                      value={body.positionX}
                      onChange={(e) => {
                        const newBodies = [...bodies];
                        newBodies[index].positionX = Number(e.target.value);
                        setBodies(newBodies);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Position Y</Label>
                    <Input
                      type="number"
                      value={body.positionY}
                      onChange={(e) => {
                        const newBodies = [...bodies];
                        newBodies[index].positionY = Number(e.target.value);
                        setBodies(newBodies);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Mass</Label>
                    <Input
                      type="number"
                      value={body.mass}
                      onChange={(e) => {
                        const newBodies = [...bodies];
                        newBodies[index].mass = Number(e.target.value);
                        setBodies(newBodies);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Size</Label>
                    <Input
                      type="number"
                      value={body.size}
                      onChange={(e) => {
                        const newBodies = [...bodies];
                        newBodies[index].size = Number(e.target.value);
                        setBodies(newBodies);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
}

export default Sim;
