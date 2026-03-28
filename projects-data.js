// Single source of truth for all projects
// Update this file to add/edit projects - both desktop and mobile will automatically update

const projectsData = [
    {
        number: "01",
        title: "Embodied Cartographies",
        url: "https://embodied-cartographies.vercel.app/",
        image: "images/projects/MappingSystems/Mapping-01.png",
        tags: ["Critical Cartography and Design Research"],
        description: "Embodied Cartographies serves as a digital repository and critical framework that unifies a diverse body of research into a singular framework.",
        visible: true
    },
    {
        number: "02",
        title: "Finding Kuku — Visual Mapping Project",
        url: "projects/FindingKuku.html",
        image: "images/projects/finding-kuku/FindingKuku2.jpeg",
        tags: ["Photography", "Mapping", "Cultural"],
        description: "A photographic journey retracing whakapapa through the East Cape, mapping personal and ancestral memory.",
        visible: true
    },
    {
        number: "03",
        title: "Mapping Human/Earth Systems — Data Visualization",
        url: "projects/MappingHumanEarthSystems.html",
        image: "images/projects/MappingSystems/Mapping-01.png",
        tags: ["Data", "Research", "Environmental"],
        description: "Visualising the complex interrelations between people and environment using data-driven maps and diagrams.",
        visible: true
    },
    {
        number: "04",
        title: "Western Sahara — Phosphate Research",
        url: "projects/WesternSahara.html",
        image: "images/projects/WSNZ/main.jpg",
        tags: ["Research", "Policy", "Web"],
        description: "Investigating phosphate extraction, colonial histories, and indigenous rights in the Western Sahara region.",
        visible: true
    },
    {
        number: "05",
        title: "Google Warming — Digital Media Research",
        url: "projects/GoogleWarming.html",
        image: "images/projects/GoogleWarming/GoogleWarming-01.png",
        tags: ["Digital", "Climate", "Research"],
        description: "Examining the role of digital platforms in shaping public understanding of climate change.",
        visible: true
    },
    {
        number: "06",
        title: "Saving Screen Time",
        url: "projects/SavingScreenTime.html",
        image: "images/projects/GEO/TEST.png",
        tags: ["Digital", "Research", "Design"],
        description: "A research and design project exploring the relationship between digital consumption, attention, and wellbeing.",
        visible: true
    },
    {
        number: "07",
        title: "Tokotoko — Te Reo Language Learning Application",
        url: "projects/Tokotoko.html",
        image: "images/projects/Tokotoko/tokotoko logo.png",
        tags: ["Web", "Design"],
        description: "A playful, experimental approach to learning te reo Māori.",
        visible: true
    },
    {
        number: "08",
        title: "Iterate — Exhibition Design",
        url: "projects/Iterate.html",
        image: "images/projects/iterate/MDI_ITERATE_EXHIBITION-01.jpg",
        tags: ["Graphic Design", "Web Design", "Exhibition Design"],
        description: "A collaborative exhibition design exploring iterative processes in postgraduate design research and practice.",
        visible: true
    },
    {
        number: "9",
        title: "Collated_Frames — Visual Storytelling",
        url: "projects/CollatedFrames.html",
        image: "images/projects/Collated-Frames/CollatedFrames1.jpg",
        tags: ["Visual", "Sequential", "Art"],
        description: "Exploring narrative through sequential imagery and experimental visual composition.",
        visible: true
    },
    // {
    //     number: "10",
    //     title: "Adlib — Brutalist Web Design",
    //     url: "projects/adlib.html",
    //     image: "adlib/adlibsimg/Adlib-23.png",
    //     tags: ["Web", "Design", "Experimental"],
    //     description: "A playful, experimental approach to web design inspired by brutalism and improvisation.",
    //     visible: false
    // },
    {
        number: "10",
        title: "KihiKihi — Installation Art",
        url: "projects/kihikihi.html",
        image: "images/projects/kihikihi/main.jpg",
        tags: ["Installation", "Art", "Spatial"],
        description: "An immersive spatial installation exploring the relationship between form, space, and materiality through experimental construction.",
        visible: true
    },
    {
        number: "11",
        title: "Empty Vessels — Video Installation",
        url: "projects/EmptyVesselsVideo.html",
        image: "images/projects/empty-vessels/Day 08 Image -05 Large.jpeg",
        tags: ["Installation", "Video", "Art"],
        description: "An immersive installation exploring space, sound, and the metaphor of the vessel.",
        visible: true
    },
    {
        number: "12",
        title: "Empty Vessels — Installation Art",
        url: "projects/EmptyVesselsInstall.html",
        image: "images/projects/empty-vessels/emptyvessels_2.jpeg",
        tags: ["Installation", "Spatial", "Art"],
        description: "An immersive installation exploring space, sound, and the metaphor of the vessel.",
        visible: true
    },
    {
        number: "13",
        title: "The Dream Atlas — Mapping Project",
        url: "projects/dream-atlas.html",
        image: "images/projects/DreamAtlas/Title.png",
        tags: ["Mapping", "Research", "Visual"],
        description: "A mapping project exploring dreams, memory, and spatial narratives through visual storytelling.",
        visible: true
    },
    // {
    //     number: "15",
    //     title: "Ändern — Language & Translation Research",
    //     url: "projects/Andern.html",
    //     image: "images/project-image.png",
    //     tags: ["Research", "Language", "Design"],
    //     description: "A personal art investigation into language and perspective, working inside German and English to see how thinking shifts when form and meaning move together.",
    //     visible: true
    // },
    {
        number: "14",
        title: "Geographic Visualisation — Environmental Data",
        url: "projects/geographic-visualisation.html",
        image: "images/projects/GEO/TEST.png",
        tags: ["Data", "Geography", "Research"],
        description: "Tools and graphics for making complex environmental data accessible through maps and visual storytelling.",
        visible: false
    },
    {
        number: "15",
        title: "OnDisplay — Series of Works",
        url: "projects/sample-project.html",
        image: "images/projects/GEO/TEST.png",
        tags: ["Installation", "Spatial", "Art"],
        description: "A curated series exploring the intersection of digital and physical display spaces through experimental exhibition design.",
        visible: false
    },
    {
        number: "16",
        title: "Pixaura — Digital Typography",
        url: "projects/Pixaura.html",
        image: "images/projects/Pixaura/EthanSheafMorrison_ass2_typespecimen_view_Page_1.jpg",
        tags: ["Typography", "Digital Media", "Creative Coding"],
        description: "A series of works exploring the relationship between technology, typography, the grid, and communication.",
        visible: true
    },
    {
        number: "17",
        title: "He Rito — Brand Identity",
        url: "projects/herito.html",
        image: "images/projects/HeRito/HeRitoExhibition09112023+(6).jpg",
        tags: ["Branding", "Design", "Typography"],
        description: "A brand identity for a Māori photography exhibition, creating a typographic and visual identity for the exhibition at Toi Poneke.",
        visible: true
    }
];
