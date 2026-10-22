import type { MediaAsset, Project } from './portfolio'

const recording = (id: string, alt: string, caption: string): MediaAsset => ({
  id: `animation-${id}`, src: `/media/projects/animation-lab/${id}.webp`,
  poster: `/media/projects/animation-lab/${id}-poster.webp`, kind: 'gif',
  alt, placeholder: alt, caption, fit: 'contain',
})

export const animationLab: Project = {
  id: 'computer-animation-lab',
  title: 'Computer Animation Lab',
  category: 'Graphics',
  coursework: true,
  featured: false,
  summary: 'An ongoing Computer Animation course, with recordings exploring moving characters, deformable meshes, cloth and fluids.',
  contribution: 'INF585 / CSC51085EP — Computer Animation coursework (in progress)',
  technologies: ['C++', 'OpenGL', 'GLSL', 'CGP', 'Eigen', 'ImGui'],
  media: {
    id: 'animation-cover', src: '/media/projects/animation-lab/cloth-poster.webp',
    alt: 'Cloth simulation interacting with a sphere in the animation lab',
    placeholder: 'Cloth simulation', fit: 'contain',
  },
  details: [],
  links: [],
  caseStudy: [
    {
      heading: 'From Motion to Simulation', navLabel: 'Overview',
      paragraphs: [
        'I am currently taking this computer animation course. Its nine labs cover procedural motion, articulated characters, interactive deformation and physical simulation. The collection below brings together recordings of the lab exercises as I work through the material.',
        'The recordings below show the exercises in action. They are grouped by what moves and how it responds: a surface reacting to a drop, a character reaching toward a target, a piece of cloth meeting an obstacle, or fluid carrying motion through space.',
      ],
    },
    {
      heading: 'Procedural Surfaces & Ripples', navLabel: 'Procedural motion',
      paragraphs: [
        'Motion can be described directly before introducing a full simulation. A textured surface changes over time, emitted spheres follow bouncing trajectories, and a water surface reacts to individual impacts.',
        'The ripple study combines a moving wave with a fading envelope. Multiple impacts overlap on the same surface, while reflection makes the changing shape easier to read.',
      ],
      media: [
        recording('water', 'Reflective water surface with expanding ripples', 'Water droplets create overlapping waves on a shader-deformed surface.'),
        recording('surface', 'Animated textured surface', 'Procedural displacement changes the surface while its lighting follows the geometry.'),
        recording('bounce', 'Bouncing spheres with contact shadows', 'Ballistic motion and contact shadows make the timing of each bounce visible.'),
      ],
    },
    {
      heading: 'Giving a Character Motion', navLabel: 'Characters',
      paragraphs: [
        'Skeletal animation separates a character’s pose from the surface around it. Clip blending creates continuous transitions between poses, while walking controls move and turn the character through the scene.',
        'Inverse kinematics reverses the usual process: instead of specifying every joint rotation, a target is placed in space and the chain adjusts to reach it. The FABRIK exercise keeps the bone lengths consistent as the target moves.',
      ],
      media: [
        recording('walking', 'Textured character responding to walking controls', 'Walking and turning with the animated skeleton driving the character mesh.'),
        recording('transition', 'Smooth transition between skeletal animation clips', 'Joint translations and quaternion interpolation blend between animation clips.'),
        recording('ik', 'Character joint chain reaching an interactive target', 'Inverse kinematics: a chain of bones follows a target while retaining its segment lengths.'),
      ],
    },
    {
      heading: 'Skinning Without the Twist Collapse', navLabel: 'Skinning',
      paragraphs: [
        'Skinning connects a mesh to its skeleton. Linear Blend Skinning is straightforward, but averaging transforms can make a twisted shape lose volume. Dual Quaternion Skinning offers a different way to blend rigid motion.',
        'These studies compare the visible deformation and explore automatically generated vertex weights, before combining skinning with a complete animated character.',
      ],
      media: [
        recording('dqs', 'Dual quaternion skinning deformation', 'Dual Quaternion Skinning preserves the shape during twisting.'),
        recording('lbs', 'Linear blend skinning deformation', 'Linear Blend Skinning provides the reference deformation.'),
        recording('weights', 'Character with automatically generated skinning weights', 'Bone-distance-based weights connect an unweighted mesh to a skeleton.'),
      ],
    },
    {
      heading: 'Collision & Contact', navLabel: 'Collisions',
      paragraphs: [
        'Falling spheres make collision response easy to inspect. Contacts with the box and with other spheres change velocities, while restitution and friction control how much energy remains after impact.',
        'This exercise connects the mathematical response to a visible result: bouncing, sliding and settling instead of objects passing through one another.',
      ],
      media: [recording('collision', 'Spheres colliding inside a box', 'Sphere–plane and sphere–sphere contact in a bounded simulation.')],
    },
    {
      heading: 'Editing a Shape by Moving a Handle', navLabel: 'Deformation',
      paragraphs: [
        'Local tools twist, translate or expand a selected part of a surface. Smooth falloff makes the transition into the untouched region gradual.',
        'The Laplacian and As-Rigid-As-Possible exercises go further: a small set of fixed and moving handles drives a larger mesh. Comparing the bunny recordings makes the difference in shape preservation visible.',
      ],
      media: [
        recording('arap', 'Stanford bunny deformed using ARAP handles', 'As-Rigid-As-Possible deformation of the bunny mesh.'),
        recording('laplacian', 'Stanford bunny deformed with Laplacian editing', 'Laplacian editing provides a useful comparison on the same kind of mesh.'),
        recording('twist', 'Interactive local twist of a mesh', 'A local twist changes the selected region with a gradual spatial falloff.'),
      ],
    },
    {
      heading: 'Soft Objects & Cloth', navLabel: 'Cloth',
      paragraphs: [
        'Shape matching moves particle-based objects toward a reference shape. Elasticity lets them recover after deformation; plasticity allows a lasting change.',
        'The cloth exercise uses a connected particle grid. Gravity, springs, wind and collisions work together to produce folds and draping around a sphere. Interactive parameters expose how sensitive the fabric is to stiffness, damping and timestep.',
      ],
      media: [
        recording('cloth', 'Cloth draping and colliding with an interactive sphere', 'The fabric responds to contact with the sphere and ground.'),
        recording('wind', 'Cloth moving under wind forces', 'Wind changes the cloth’s movement while fixed points keep it anchored.'),
        recording('elastic', 'Elastic shape-matching objects', 'Elastic objects deform under contact and move back toward their reference shape.'),
      ],
    },
    {
      heading: 'Two Ways to Animate a Fluid', navLabel: 'Fluids',
      paragraphs: [
        'Smoothed Particle Hydrodynamics represents fluid with moving particles. Density, pressure and viscosity produce a collective response; changing viscosity shifts the motion from energetic splashing to a more damped flow.',
        'Stable Fluids represents velocity and density on a grid instead. Advection transports the fields, diffusion spreads them, and a pressure projection reduces divergence. The recordings make the difference between particle and grid representations tangible.',
      ],
      media: [
        recording('stable-fluid', 'Grid-based fluid forming vortical motion', 'Stable Fluids with a divergence-free projection step.'),
        recording('advection', 'Fluid density transported through a velocity field', 'Semi-Lagrangian advection carries density through the grid.'),
        recording('sph', 'Particle-based fluid simulation with viscosity', 'SPH: neighboring particles exchange forces through pressure and viscosity.'),
      ],
    },
  ],
}

