export const TRANSITION_TYPE_BROLL = 1
export const TRANSITION_TYPE_ORIGINAL = 2
import { random } from "remotion";
import axios from "axios";

export const msConversion = (millis) => {
  let sec = Math.floor(millis / 1000);
  let hrs = Math.floor(sec / 3600);
  sec -= hrs * 3600;
  let min = Math.floor(sec / 60);
  sec -= min * 60;

  sec = '' + sec;
  sec = ('00' + sec).substring(sec.length);

  if (hrs > 0) {
    min = '' + min;
    min = ('00' + min).substring(min.length);
    return hrs + ":" + min + ":" + sec;
  }
  else {
    return min + ":" + sec;
  }
};

function sumOfLengths(list, text) {
    let sum = 0;
    for (let i = 0; i < list.length; i++) {
        sum += list[i].length;
    }
    sum += text.length 
    return sum;
};

function isSentenceEnd(word) {
  // Check if the word ends with a sentence-ending punctuation
  return /[.!?]$/.test(word.trim());
};

export const groupWords = (data,theme) => {
  if(data.length == 0) {
      return []	    
  }
  const groups = [];
  let currentGroup = {from:null,to:null,words:[],wordStamps:[],wordColors:[],randomColor:'#FFFFFF',randomTilt:0,randomRotate:'0deg',emoji:'',position:null,size:null};
  let previousStart = data[0].offsets.from;

  for (const item of data) {
    const offsetStart = item.offsets.from;
    let randomRotate = '0deg'
    let randomColor = '#FFFFFF'
    let randomTilt = 0
    if(theme.hasOwnProperty("rotate")){
      randomRotate = theme.rotate[(random(item.text) * theme.rotate.length) | 0]
    }
    if(theme.highlightColor.length>1){
      randomColor = theme.highlightColor[(random(item.text) * theme.highlightColor.length) | 0]
    }
    if(theme.hasOwnProperty("tilt")){
      randomTilt = Math.floor(random(item.text) * (10 - (-10) + 1)) + (-10);
    }
    if (offsetStart - previousStart <= 1000 && currentGroup.words.length<4 && sumOfLengths(currentGroup.words, item.text)<22) { 
      // currentGroup.push(item);
      if(currentGroup.from==null){
        currentGroup.from = item.offsets.from
      }
      currentGroup.to = item.offsets.to
      currentGroup.words.push(item.text)
      currentGroup.wordStamps.push(item.offsets.from)
      currentGroup.wordColors.push(Math.floor(random(item.text) * 10)<7?false:true)
      currentGroup.randomRotate = randomRotate
      currentGroup.randomTilt = randomTilt
      currentGroup.randomColor = randomColor
      if (currentGroup.emoji === undefined || currentGroup.emoji === null || currentGroup.emoji === "") {
          currentGroup.emoji = item.emoji!==null?item.emoji:""
      }
    } else {
      groups.push(currentGroup);
      // currentGroup = [item];
      currentGroup = {
        from:item.offsets.from,
        to:item.offsets.to,
        words:[item.text],
        wordStamps:[item.offsets.from],
        wordColors:[false],
        randomColor:randomColor,
        randomTilt:randomTilt,
        randomRotate:randomRotate,
        emoji:item.emoji!==null?item.emoji:"",
      }
    }
    if (isSentenceEnd(item.text)) {
        // Finalize the current group and prepare for a new group
        groups.push(currentGroup);
        currentGroup = {from:null,to:null,words:[],wordStamps:[],wordColors:[],randomColor:'#FFFFFF',randomTilt:0,randomRotate:'0deg',emoji:'',position:null,size:null};
    }
    previousStart = offsetStart;
  }

  if (currentGroup.words.length>0) {
    groups.push(currentGroup);
  }
  return groups;
};

export const calculateResolutionAndAspectRatio = (height,width)=>{
  const gcd = (a, b) => {
    if (b === 0) return a;
    return gcd(b, a % b);
  };

  // Calculate the aspect ratio
  const aspectRatio = `${width / gcd(width, height)}:${height / gcd(width, height)}`;

  return {"height": height, "width": width, "aspectRatio": aspectRatio}
};

export const calculateNewDimensions = (originalWidth, originalHeight, aspectWidth, aspectHeight) => {
  let newWidth, newHeight;

  if (originalWidth / originalHeight > aspectWidth / aspectHeight) {
    newHeight = originalHeight;
    newWidth = Math.round((originalHeight * aspectWidth) / aspectHeight);
  } else {
    newWidth = originalWidth;
    newHeight = Math.round((originalWidth * aspectHeight) / aspectWidth);
  }

  return { width: newWidth, height: newHeight };
};

export const comic_images = [
  '/comic/comic_image_1.png',
  '/comic/comic_image_2.png',
  '/comic/comic_image_3.png',
  '/comic/comic_image_4.png',
  '/comic/comic_image_5.png',
  '/comic/comic_image_6.png',
  '/comic/comic_image_7.png',
  '/comic/comic_image_8.png',
];

export const aiApps = [
  { name: 'AI Image Upscaler', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/957111103504/cb320a8f-d900-46f3-9637-cb1a6adcc67b.jpg', url: '/ai-tools/image-upscaler' },
  // { name: 'AI Video Upscaler', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/491460249936/3af3212f-f6f0-4d2e-aab8-44104086964e.jpg', url: '/ai-tools/video-upscaler' },
  { name: 'Image Face Swap', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/810757386575/bbdfbe2b-f038-49bd-ba36-970132d88c0d.jpg', url: '/ai-tools/image-face-swap' },
  { name: 'Video Face Swap', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/181439794229/00fe476a-843b-42d0-b9e3-d5661789ee51.jpg', url: '/ai-tools/video-face-swap' },
  { name: 'Preset Headshots', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/591400551569/917e4394-b592-4134-bd65-0c1edca07fa7.jpg', url: '/ai-tools/ai-preset-headshots' },
  { name: 'AI Dress Change', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/197735168907/027735d0-3159-4dea-9941-98faea7d4757.jpg', url: '/ai-tools/ai-dress-change' },
  { name: 'AI Lip Sync', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/339930001376/c8a0b758-48ea-4038-8274-9cf8b7dcc216.jpg', url: '/ai-tools/ai-lip-sync' },
  { name: 'AI Voiceover', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/607982836630/c5563a81-c3fd-41f7-b13b-8f46aad9c737.jpg', url: '/ai-tools/ai-voiceover' },
  { name: 'AI Sound Effect', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/586273669517/2746b0d2-e9a8-4861-b558-0b8a565620a9.jpg', url: '/ai-tools/ai-sound-effect' },
  { name: 'AI Thumbnail Maker', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/242275481432/02521442-0926-49b0-a42e-3f2c038f0ec5.jpg', url: '/ai-tools/ai-thumbnail-maker' },
  { name: 'AI Background Remover', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/697339036330/4f773837-0e42-4ca3-a8b8-6a8183ccc6a4.jpg', url: '/ai-tools/ai-background-remover' },
  { name: 'AI Product Shot', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/484561104928/32d97a0d-ba32-467d-beec-be70e76937c4.jpg', url: '/ai-tools/ai-product-shot' },
  { name: 'AI Filter', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/265502067808/c1da66e5-dffa-4612-8eec-d8d62c25bca5.jpg', url: '/ai-tools/ai-filter' },
  { name: 'AI Skin Enhancer', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/762958357866/c44bd09c-4c65-4979-b6a8-fb4290083c17.jpg', url: '/ai-tools/ai-skin-enhancer' },
  { name: 'April Fools Prank', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/941670625013/fbd55733-8ee5-456b-91bb-cc256d28a500.jpg', url: '/ai-tools/april-fools-prank' },
  { name: 'Product Photography', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/910084288045/3f2fe25b-37e0-408a-88a5-fc33cdf89463.jpg', url: '/ai-tools/product-photography' },
  { name: 'AI Hair Style Changer', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/312501751877/a68b6202-d8dc-4fd9-9373-3827b8c805a8.jpg', url: '/ai-tools/ai-hair-style' },
  { name: 'AI Dress Color Change', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/672719959491/9f1a9edc-4441-4228-a4e6-82c5f6184157.jpg', url: '/ai-tools/ai-dress-color' },
  { name: 'AI Color Photo', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/713980794052/ad41b606-844d-451a-bd9a-b9222ae6208c.jpg', url: '/ai-tools/ai-color-photo' },
  { name: 'AI Image Extender', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/613591278446/ffb60a2f-bf1c-4b49-aaeb-f3f3a13a9b29.jpg', url: '/ai-tools/ai-image-extension' },
  { name: 'AI Ghibli Style', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/961303194179/ab4b0c00-159b-4558-a07a-59cdfb9b0c84.jpg', url: '/ai-tools/ai-ghibli-style' },
  { name: 'Anime Art Generator', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/264047536109/94d773d1-816a-4967-b649-3872ba448eb4.jpg', url: '/ai-tools/ai-anime-generator' },
  { name: 'AI Object Eraser', image: 'https://d3adwkbyhxyrtq.cloudfront.net/aivideo/images/186/528399205012/ChatGPT_Image_Apr_1__2025__06_10_44_PM.png', url: '/ai-tools/ai-object-eraser' },
  { name: 'AI Change Pose', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/397377640882/52b6b201-1345-4017-87db-9bbd8177b73d.jpg', url: '/ai-tools/ai-change-pose' },
  { name: 'AI Celebrity Image', image: 'https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/969605241732/8ec2cd45-4dad-4c63-a3be-533e44e2c4a0.jpg', url: '/ai-tools/ai-celebrity-image' },

];

export const fluxLoraModels = [
  {
    "name": null,
    "description": null,
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/webassets/none.png"
  },
  {
    "name": "Midjourney V6.1 meets FLUX",
    "description": "This Lora was trained with 34 Midjourney V6.1 images. Use aidmaMJ6.1 to trigger the Lora.",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/99c13c70-da0e-11ef-9691-99c5509aa859.jpg"
  },
  {
    "name": "Flux Realism",
    "description": "Photorealistic model for hyper-realistic images.",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/b30725e0-da00-11ef-9691-99c5509aa859.jpg"
  },
  {
    "name": "60s Psychedelic Movie",
    "description": "Mimics 60s psychedelic movie stills. Trigger: ArsMovieStill, movie still from a 60s psychedelic movie.",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/2bee9f10-d7d1-11ef-86d4-957396b21e70.jpg"
  },
  {
    "name": "Organic Sauce",
    "description": "Blends charcoal sketches, watercolor, and hand-drawn styles for a non-anime aesthetic.",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/793f1780-d778-11ef-b1af-3332a68f86bd.jpg"
  },
  {
    "name": "Amateur Photography",
    "description": "Simulates casual iPhone/low-quality camera photos.",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/a6bcb8a0-d70c-11ef-8fd6-9bd833a3e0c8.jpg"
  },
  {
    "name": "Vintage Anime",
    "description": "Retro anime style from the 1970s-1990s with muted colors and bold outlines.",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/23d16660-d6c2-11ef-a2c8-4334694e75d5.jpg"
  },
  {
    "name": "Retro Anime Flux",
    "description": "Captures Midjourney-generated retro anime. No trigger word required.",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/62377130-d779-11ef-818d-81383a410a43.jpg"
  },
  {
    "name": "ILLUSTRATION",
    "description": "Cartoonish/illustration style for artistic fictional looks.",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/79bd6fc0-d3c9-11ef-bdec-fb6822ccf241.jpg"
  },
  {
    "name": "Claymation",
    "description": "Creates clay animation stills. Trigger: claymation.",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/40a86310-d3c5-11ef-bdec-fb6822ccf241.jpg"
  },
  {
    "name": "Convenience store CCTV",
    "description": "Trained on 450+ CCTV frames. Trigger: StoreCCTV (strength ≥1.5).",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/ef8f4499-811c-6672-a314-8ee0a1faf72d.jpeg"
  },
  {
    "name": "80s Fantasy Movie",
    "description": "Emulates early 80s fantasy movies. Trigger: ArsMovieStill, 80s Fantasy Movie Still.",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/78017490-d49d-11ef-a125-37bcaa0f7ea4.jpg"
  },
  {
    "name": "LET ME SEE YOUR GRILLZ FLUX",
    "description": "Trained on 'iced out' jewelry. Trigger: GR!LLZ, SMILE (strength 0.7-0.9).",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/3de68800-d546-11ef-b428-6f2a79e2fb35.jpg"
  },
  {
    "name": "Boss Battle",
    "description": "Inspired by Dark Souls, Elden Ring, and COD Zombies.",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/8e5def60-7247-11ef-b942-c3ed7e429df5.mp4"
  },
  {
    "name": "Boring Reality",
    "description": "No description provided.",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/d1c14f60-7efc-11ef-80c5-5554da8c130d.mp4"
  },
  {
    "name": "1999 Camera Style",
    "description": "Emulates the Olympus D-450 Zoom (1999) for nostalgic, retro visuals.",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/cad3f800-db5f-11ef-84be-7d58ca7aafd5.jpg"
  },
  {
    "name": "Vintage Photo",
    "description": "Recreates old photos with washed-out colors or B&W.",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/bbad3780-716d-11ef-9671-67bd79b65756.mp4"
  },
  {
    "name": "Dark Comic",
    "description": "Combines graphic novels and horror aesthetics.",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/0dbb57c0-72c5-11ef-a7f6-43bf4b58bf5d.mp4"
  },
  {
    "name": "Hard Edge Pixel Art",
    "description": "Pixel art style. Trigger: pixel art.",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/ecce8b70-7131-11ef-8d4f-a3a50b8763ad.mp4"
  },
  {
    "name": "VHS Style",
    "description": "Retro 90s VHS effect.",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/ac8d91f0-da2c-11ef-8b06-63fc00fa1e69.jpg"
  },
  {
    "name": "3D Render",
    "description": "High-quality 3D renderings.",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/fbcd02f0-70f5-11ef-91b1-1358266f04dc.mp4"
  },
  {
    "name": "Moody Photo Style",
    "description": "Analog 35mm film for moody realism.",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/6d6e6940-718b-11ef-b7b6-85558717b410.mp4"
  },
  {
    "name": "Cyberpunk Anime",
    "description": "Cyberpunk anime aesthetics.",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/fluxlora/eb6cff40-70e7-11ef-a9ab-fb8d2d74ead2.mp4"
  }
];

export const fluxModels = [
  {
    id: "schnell",
    name: "Flux Schnell",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/230967527308/d65c9c50-3604-43fe-9255-92685a84c91d.jpg",
    description: "High-quality images from text in 1 to 4 steps",
    duration: 5,
    credits: 2,
    num: 4
  },
  {
    id: "dev",
    name: "Flux Dev",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/325703928897/e3f3bcbc-c6ef-46de-9639-2fb7498eabad.jpg",
    description: "Development version of Flux model",
    duration: 10,
    credits: 6,
    num: 2
  },
  {
    id: "lora",
    name: "Flux LoRA",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/237134950854/773fa85c-71d1-4684-b423-bd5ab1f97ffa.jpg",
    description: "Enabling rapid and high-quality image generation",
    duration: 10,
    credits: 6,
    num: 2
  },
  {
    id: "pro",
    name: "Flux Pro v1.1",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/420959112663/960e8ada-f6d9-4894-9ca1-8cf2436e47c8.jpg",
    description: "Professional version with enhanced capabilities",
    isPro: true,
    duration: 25,
    credits: 12,
    num: 1
  },
  {
    id: "ultra",
    name: "Flux Pro Ultra v1.1",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/411267126627/fd2e347d-e308-45c5-abfe-c5e9ac49b99c.jpg",
    description: "Ultimate version with maximum quality",
    isPro: true,
    duration: 30,
    credits: 18,
    num: 1
  },
  {
    id: "bytedance",
    name: "Seedream-v3",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/958012868787/9ae11fa2-2ed6-412f-8834-e4e437bdfb04.jpg",
    description: "It transforms text into vivid images with remarkable details.",
    duration: 10,
    credits: 5,
    num: 1
  },
  {
    id: "kontext",
    name: "Flux Kontext",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/379496223892/f81495f7-de22-4579-bc46-91fd8f90f3f3.jpg",
    description: "It delivers state-of-the-art image generation results",
    isPro: true,
    duration: 10,
    credits: 8,
    num: 1
  },
  {
    id: "recraft",
    name: "Recraft-v3",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/fake_text/profile_images/186/699675542299/phYdzaZKutHgEIdAqguSd_image.webp",
    description: "Recraft-v3 generate vector art, images in brand style and more",
    duration: 10,
    credits: 15,
    num: 1
  },
  {
    id: "minimax",
    name: "Minimax/Hailuoai",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/304342023192/b9b55144-03de-424a-918b-d6dcd12fa0a4.jpg",
    description: "Longer text prompts will result in better quality images.",
    isPro: true,
    duration: 10,
    credits: 12,
    num: 2
  },
  {
    id: "imagen3",
    name: "Google Imagen 3",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/781515889759/1647c937-a447-40e1-9d16-365d6bfe0c4b.jpg",
    description: "Google's advanced AI image generation model",
    isPro: true,
    duration: 10,
    credits: 6,
    num: 2
  },
  {
    id: "imagen4",
    name: "Google Imagen 4",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/153202992159/a9ce2d81-ffd3-41b4-9742-93a497c2e105.jpg",
    description: "Google’s highest quality image generation model",
    isPro: true,
    duration: 10,
    credits: 10,
    num: 2
  },
  {
    id: "midjourney",
    name: "Midjourney v7",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/403104061561/77e7a150-d68d-4c03-b18e-bcb177c93f1b.jpg",
    description: "Midjorney v7 generates 4 unique images",
    duration: 10,
    credits: 6,
    num: 4
  },
  {
    id: "ideogram",
    name: "Ideogram v3",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/495423469201/b7c44c4a-c6c5-4a39-93f2-663047f9bed5.jpg",
    description: "High quality images with accurate text rendering",
    isPro: true,
    duration: 30,
    credits: 12,
    num: 1
  },
  {
    id: "gpt",
    name: "GPT-Image-1",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/166725730729/e2fc912f-9394-44b7-a9c2-eaac178f7c27.jpg",
    description: "This multimodal AI that seamlessly understands and generates images.",
    isPro: true,
    duration: 30,
    credits: 12,
    num: 1
  },
];

export const aspectRatios = [
  { name: "Square", ratio: "1:1", resolution: "512 512", width: 16, height: 16 },
  { name: "Square HD", ratio: "1:1", resolution: "1024 1024", width: 20, height: 20 },
  { name: "Portrait", ratio: "3:4", resolution: "768 1024", width: 12, height: 16 },
  { name: "Portrait", ratio: "9:16", resolution: "576 1024", width: 9, height: 16 },
  { name: "Landscape", ratio: "16:9", resolution: "1024 576", width: 16, height: 9 },
  { name: "Landscape", ratio: "4:3", resolution: "1024 768", width: 16, height: 12 },
];

export const kontextAspectRatios = [
  { name: "Square", ratio: "1:1", resolution: "1024 1024", width: 16, height: 16 },
  { name: "Portrait", ratio: "3:4", resolution: "880 1184", width: 12, height: 16 },
  { name: "Portrait", ratio: "9:16", resolution: "752 1392", width: 9, height: 16 },
  { name: "Portrait", ratio: "2:3", resolution: "832 1248", width: 6, height: 8 },  
  { name: "Portrait", ratio: "9:21", resolution: "672 1536", width: 9, height: 21 },
  { name: "Landscape", ratio: "16:9", resolution: "1392 752", width: 16, height: 9 },
  { name: "Landscape", ratio: "4:3", resolution: "1184 880", width: 16, height: 12 },
  { name: "Landscape", ratio: "3:2", resolution: "1248 832", width: 8, height: 6 },
  { name: "Landscape", ratio: "21:9", resolution: "1536 672", width: 21, height: 9 },
];

export const ultraAspectRatios = [
  { name: "Square", ratio: "1:1", resolution: "2048 2048", width: 16, height: 16 },
  { name: "Portrait", ratio: "3:4", resolution: "1792 2368", width: 12, height: 16 },
  { name: "Portrait", ratio: "9:16", resolution: "1536 2752", width: 9, height: 16 },
  { name: "Portrait", ratio: "2:3", resolution: "1664 2496", width: 6, height: 8 },  
  { name: "Portrait", ratio: "9:21", resolution: "1344 3136", width: 9, height: 21 },
  { name: "Landscape", ratio: "16:9", resolution: "2752 1536", width: 16, height: 9 },
  { name: "Landscape", ratio: "4:3", resolution: "2368 1792", width: 16, height: 12 },
  { name: "Landscape", ratio: "3:2", resolution: "2496 1664", width: 8, height: 6 },
  { name: "Landscape", ratio: "21:9", resolution: "3136 1344", width: 21, height: 9 },
];

export const imagen3AspectRatios = [
  { name: "Square", ratio: "1:1", resolution: "2048 2048", width: 16, height: 16 },
  { name: "Portrait", ratio: "3:4", resolution: "1792 2368", width: 12, height: 16 },
  { name: "Portrait", ratio: "9:16", resolution: "1536 2752", width: 9, height: 16 },
  { name: "Landscape", ratio: "16:9", resolution: "2752 1536", width: 16, height: 9 },
  { name: "Landscape", ratio: "4:3", resolution: "2368 1792", width: 16, height: 12 },
];

export const midjorneyAspectRatios = [
  { name: "Square", ratio: "1:1", resolution: "1024 1024", width: 16, height: 16 },
  { name: "Portrait", ratio: "2:3", resolution: "896 1344", width: 6, height: 8 },
  { name: "Portrait", ratio: "9:16", resolution: "816 1456", width: 9, height: 16 },
  { name: "Landscape", ratio: "16:9", resolution: "1456 816", width: 16, height: 9 },
  { name: "Landscape", ratio: "4:3", resolution: "1232 928", width: 16, height: 12 },
];

export const minimaxAspectRatios = [
  { name: "Square", ratio: "1:1", resolution: "1024 1024", width: 16, height: 16 },
  { name: "Portrait", ratio: "3:4", resolution: "864 1152", width: 12, height: 16 },
  { name: "Portrait", ratio: "9:16", resolution: "720 1280", width: 9, height: 16 },
  { name: "Portrait", ratio: "2:3", resolution: "832 1248", width: 6, height: 8 },  
  { name: "Landscape", ratio: "16:9", resolution: "1280 720", width: 16, height: 9 },
  { name: "Landscape", ratio: "4:3", resolution: "1152 864", width: 16, height: 12 },
  { name: "Landscape", ratio: "3:2", resolution: "1248 832", width: 8, height: 6 },
  { name: "Landscape", ratio: "21:9", resolution: "1344 576", width: 21, height: 9 },
];

export const gptAspectRatios = [
  { name: "Square HD", ratio: "1:1", resolution: "1024 1024", width: 20, height: 20 },
  { name: "Landscape", ratio: "3:2", resolution: "1536 1024", width: 20, height: 13.33 },
  { name: "Portrait", ratio: "2:3", resolution: "1024 1536", width: 13.33, height: 20 },
];

export const magicBrushModels = [
  {
    id: "gpt",
    name: "GPT-Image Inpainting",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/166725730729/e2fc912f-9394-44b7-a9c2-eaac178f7c27.jpg",
    description: "OpenAI's latest image generation and editing model",
    duration: 5,
    credits: 12,
    num: 1
  },
  {
    id: "lora",
    name: "Flux LoRA Inpainting",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/237134950854/773fa85c-71d1-4684-b423-bd5ab1f97ffa.jpg",
    description: "Super fast inpainting model with LoRA support",
    duration: 5,
    credits: 10,
    num: 1
  },
  // {
  //   id: "fast_lightning",
  //   name: "Fast Lightning sdxl",
  //   description: "Run SDXL at the speed of light",
  //   duration: 10,
  //   credits: 2,
  //   num: 1
  // },
];

export const flashEditModels = [
  {
    id: "gpt",
    name: "GPT-Image Flash Edit",
    description: "Uses OpenAI's GPT model for intuitive, language-guided image modifications and enhancements.",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/578624632597/b4153fae-f5dd-4d78-a300-0ba54b0fb7be.jpg",
    duration: 10,
    credits: 12,
    num: 1
  },
  {
    id: "gemini",
    name: "Gemini Flash Edit",
    description: "Leverages Google's Gemini model for high-precision image editing with smart recognition.",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/956296497572/532f121e-6dc5-4077-a852-24c1837ebad7.jpg",
    duration: 5,
    credits: 10,
    num: 1
  },
  {
    id: "edit_kontext",
    name: "Flux Kontext Edit",
    description: "Flux Kontext enables precise scene edits and transformations using both text and reference images.",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/428322592859/641f9c56-4a3a-43e6-b4e7-2b59ed8ba8b6.jpg",
    duration: 5,
    credits: 8,
    num: 1
  },
  {
    id: "seed_edit",
    name: "SeedEdit-v3",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/476615850974/89d8b617-f7ae-4dbd-be65-6e78f7002b36.jpg",
    description: "It is a text-driven image editing model that enables precise edits through natural language.",
    duration: 10,
    credits: 4,
    num: 1
  },
];

export const hunyuanLoraModels = [
  {
    "name": null,
    "path": null,
    "scale": null,
    "trigger_word": null,
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/webassets/none.png",
    "type": 'image'
  },
  {
    "name": "Flat Color - Style",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/hunyuanlora/vid_00020.mp4",
    "path": "https://civitai.com/api/download/models/1315010?type=Model&format=SafeTensor",
    "scale": 0.8,
    "trigger_word": "flat color, no lineart",
    "type": "video"
  },
  {
    "name": "SECRET SAUCE",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/hunyuanlora/HunyuanVideo_00019_chf3_prob3.mp4",
    "path": "https://civitai.com/api/download/models/1193204?type=Model&format=SafeTensor",
    "scale": 1.1,
    "trigger_word": "",
    "type": "video"
  },
  {
    "name": "Frieren",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/hunyuanlora/vid_00050.mp4",
    "path": "https://civitai.com/api/download/models/1322878?type=Model&format=SafeTensor",
    "scale": 1,
    "trigger_word": "frieren, elf, white hair, twintails, pointy ears, green eyes",
    "type": "video"
  },
  {
    "name": "Studio Ghibli",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/ComfyUI_00008_+(3).webp",
    "path": "https://civitai.com/api/download/models/1218122?type=Model&format=SafeTensor",
    "scale": 1,
    "trigger_word": "frieren, elf, white hair, twintails, pointy ears, green eyes",
    "type": "image"
  },
  {
    "name": "Mita - MiSide",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/hunyuanlora/vid_00055.mp4",
    "path": "https://civitai.com/api/download/models/1294628?type=Model&format=SafeTensor",
    "scale": 1,
    "trigger_word": "Mita, 1girl, twintails, scrunchie, hair scrunchie, red shirt, blue skirt, skirt, thighhighs, red thighhighs, hairband, hair ornament",
    "type": "video"
  },
  /*
  {
    "name": "Elizabeth Olsen",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/hunyuanlora/vid_00038.mp4",
    "path": "https://civitai.com/api/download/models/1346865?type=Model&format=SafeTensor",
    "scale": 1.1,
    "trigger_word": "",
    "type": "video"
  },
  */
  {
    "name": "Passionate Kissing",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/hunyuanlora/t2v_2_00004.mp4",
    "path": "https://civitai.com/api/download/models/1509369?type=Model&format=SafeTensor",
    "scale": 1,
    "trigger_word": "Kissing passionately, passionate kiss",
    "type": "video"
  },
  {
    "name": "Super Realistic Ahegao",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/hunyuanlora/HunyuanVideo_00457.mp4",
    "path": "https://civitai.com/api/download/models/1207650?type=Model&format=SafeTensor",
    "scale": 1.1,
    "trigger_word": "ahegao face, cross-eyed, tongue sticking out",
    "type": "video"
  },
  {
    "name": "HeavyMetalStyle",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/hunyuanlora/ComfyUI_00701_.webp",
    "path": "https://civitai.com/api/download/models/1356835?type=Model&format=SafeTensor",
    "scale": 1.1,
    "trigger_word": "HeavyMetalStyle animation of",
    "type": "image"
  },
  {
    "name": "Boreal-HL",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/hunyuanlora/boreal-sequence-2.mp4",
    "path": "https://civitai.com/api/download/models/1376844?type=Model&format=SafeTensor",
    "scale": 1.1,
    "trigger_word": "",
    "type": "video"
  },
  {
    "name": "Graphical Clothes",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/hunyuanlora/Video_00197.mp4",
    "path": "https://civitai.com/api/download/models/1383791?type=Model&format=SafeTensor",
    "scale": 1.1,
    "trigger_word": "",
    "type": "video"
  },
  {
    "name": "Digital Human",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/hunyuanlora/ComfyUI_00004_.webp",
    "path": "https://civitai.com/api/download/models/1354515?type=Model&format=SafeTensor",
    "scale": 1.1,
    "trigger_word": "",
    "type": "image"
  },
  {
    "name": "Underground Club",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/hunyuanlora/b34ec02dee5f4d33676f2e7b8dd0ce3c.mp4",
    "path": "https://civitai.com/api/download/models/1237165?type=Model&format=SafeTensor",
    "scale": 1.1,
    "trigger_word": "underground club",
    "type": "video"
  },
  {
    "name": "Female - Face Portraits",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/hunyuanlora/videos_00004-audio.mp4",
    "path": "https://civitai.com/api/download/models/1324243?type=Model&format=SafeTensor",
    "scale": 0.8,
    "trigger_word": "",
    "type": "video"
  },
  /*
  {
    "name": "Eimi Fukada",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/hunyuanlora/vid_00331.mp4",
    "path": "https://civitai.com/api/download/models/1282806?type=Model&format=SafeTensor",
    "scale": 1.1,
    "trigger_word": "eimifukada",
    "type": "video"
  },
  */
  {
    "name": "AnimeShots",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/hunyuanlora/ComfyUIVid_00007.mp4",
    "path": "https://civitai.com/api/download/models/1194497?type=Model&format=SafeTensor",
    "scale": 1,
    "trigger_word": "anime",
    "type": "video"
  },
  /*
  {
    "name": "Natalie Dormer",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/hunyuanlora/vid_00294.mp4",
    "path": "https://civitai.com/api/download/models/1405802?type=Model&format=SafeTensor",
    "scale": 1.1,
    "trigger_word": "",
    "type": "video"
  },
  {
    "name": "Kanna Hashimoto",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/hunyuanlora/01.mp4",
    "path": "https://civitai.com/api/download/models/1611909?type=Model&format=SafeTensor",
    "scale": 1.1,
    "trigger_word": "kanna",
    "type": "video"
  },
  {
    "name": "Emma Watson",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/hunyuanlora/watson-1.3-pg-combined.mp4",
    "path": "https://civitai.com/api/download/models/1603276?type=Model&format=SafeTensor",
    "scale": 1.1,
    "trigger_word": "",
    "type": "video"
  },
  {
    "name": "Jennifer Connelly 1990s",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/hunyuanlora/vid_00108.mp4",
    "path": "https://civitai.com/api/download/models/1372305?type=Model&format=SafeTensor",
    "scale": 1.1,
    "trigger_word": "",
    "type": "video"
  },
  */
  {
    "name": "Geometric Woman",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/hunyuanlora/Video_00257.mp4",
    "path": "https://civitai.com/api/download/models/1381374?type=Model&format=SafeTensor",
    "scale": 1.1,
    "trigger_word": "geometric shapes, gradient, horns, pattern, moon",
    "type": "video"
  },
];

export const wan21LoraModels = [
  {
    "name": null,
    "path": null,
    "scale": null,
    "trigger_word": null,
    "input_type": null,
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/webassets/none.png",
    "type": 'image'
  },
  {
    "name": "Aesthetic Quality Modifiers",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/ComfyUI_00392_.webp",
    "path": "https://civitai.com/api/download/models/1498121?type=Model&format=SafeTensor",
    "scale": 0.8,
    "input_type": "t2v",
    "trigger_word": "masterpiece, very aesthetic",
    "type": "image"
  },
  {
    "name": "Flat Color - Style",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/ComfyUI_00186_.mp4",
    "path": "https://civitai.com/api/download/models/1474944?type=Model&format=SafeTensor",
    "scale": 1,
    "input_type": "i2v and t2v",
    "trigger_word": "flat color, no lineart",
    "type": "video"
  },
  {
    "name": "Slime Girl Concept",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/ComfyUI_00698_.webp",
    "path": "https://civitai.com/api/download/models/1559317?type=Model&format=SafeTensor",
    "scale": 1,
    "input_type": "t2v",
    "trigger_word": "slime girl, blue skin, liquid hair, transparent, see-through",
    "type": "image"
  },
  {
    "name": "Frieren",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/ComfyUI_00295_.webp",
    "path": "https://civitai.com/api/download/models/1505137?type=Model&format=SafeTensor",
    "scale": 1,
    "input_type": "t2v",
    "trigger_word": "frieren, green eyes, elf, pointy ears, twintails, white hair, white capelet",
    "type": "image"
  },
  {
    "name": "360 Degree Rotation",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/9716caf8-ef8e-4778-9822-cf40030eca88.mp4",
    "path": "https://civitai.com/api/download/models/1520902?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "i2v",
    "trigger_word": "r0t4tion 360 degrees rotation",
    "type": "video"
  },
  {
    "name": "Phut Hon Dance",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/WanVideo2_1_00225.mp4",
    "path": "https://civitai.com/api/download/models/1542806?type=Model&format=SafeTensor",
    "scale": 1,
    "input_type": "i2v",
    "trigger_word": "dabaichui, making dabaichui motion",
    "type": "video"
  },
  {
    "name": "Detail Enhancer for WAN",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/WanVideo2_1_00052.mp4",
    "path": "https://civitai.com/api/download/models/1565668?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "t2v",
    "trigger_word": "",
    "type": "video"
  },
  {
    "name": "Passionate Kissing",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/Wan-T2v_00007.mp4",
    "path": "https://civitai.com/api/download/models/1574869?type=Model&format=SafeTensor",
    "scale": 1,
    "input_type": "i2v",
    "trigger_word": "Passionate Kissing, Kiss passionately",
    "type": "video"
  },
  {
    "name": "Studio Ghibli",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/WanVideo2_1_T2V_00010.mp4",
    "path": "https://civitai.com/api/download/models/1587891?type=Model&format=SafeTensor",
    "scale": 1,
    "input_type": "t2v",
    "trigger_word": "Studio Ghibli style",
    "type": "video"
  },
  {
    "name": "Pixel Art Animation",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/38ae400b-f9fb-405a-8891-7c6a3ae3df3a_reduced.mp4",
    "path": "https://civitai.com/api/download/models/1623701?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "i2v",
    "trigger_word": "p1x3lStyl3, This p1x3lStyl3 animation features a character rendered in a pixelated style against a plain white background. The p1x3lStyl3 character initially stands facing forward, wearing her iconic blue shark hoodie with the hood down, showcasing her white and blue p1x3lStyl3 hair and bright blue eyes. Her hands are loosely clenched at her sides, and her blue p1x3lStyl3 shark tail rests behind her. The p1x3lStyl3 animation consists of a subtle loop where she slightly bends her knees, causing her whole p1x3lStyl3 body to dip down slightly. Simultaneously, her p1x3lStyl3 tail gives a small, gentle swish to the side. She then smoothly returns to her original standing pose, ready for the loop to repeat, creating a simple, idle p1x3lStyl3 animation.",
    "type": "video"
  },
  {
    "name": "SingularUnity",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/wan_Orbit_MC_Test_EP81.safetensors-Seed741-DeN1-Tea0.25000000000000006_00001.mp4",
    "path": "https://civitai.com/api/download/models/1666048?type=Model&format=SafeTensor",
    "scale": 1,
    "input_type": "i2v",
    "trigger_word": "Fluid cinematic camera orbits with steady pacing to emphasize three-dimensionality and spatial depth, Realistic soft-body dynamics accentuated through natural movement and detailed close-ups, Dynamic camera angles paired with controlled lighting to highlight texture, form, and lifelike physics, Uninterrupted pans and zooms synced to rhythmic motion for immersive, professional pacing, Realistic jiggling and bouncing breasts",
    "type": "video"
  },
  {
    "name": "The Walking Back",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/20250319_105728_WanVideo__00001.mp4",
    "path": "https://civitai.com/api/download/models/1550982?type=Model&format=SafeTensor",
    "scale": 1,
    "input_type": "i2v",
    "trigger_word": "walking from behind",
    "type": "video"
  },
  {
    "name": "Squish Effect",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/WanVideo2_1_00033.mp4",
    "path": "https://civitai.com/api/download/models/1513385?type=Model&format=SafeTensor",
    "scale": 1,
    "input_type": "i2v",
    "trigger_word": "sq41sh squish effect",
    "type": "video"
  },
  {
    "name": "Ahegao Face",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/vid_00071.mp4",
    "path": "https://civitai.com/api/download/models/1614467?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "i2v and t2v",
    "trigger_word": "ahegao_face, she makes the ahegao face",
    "type": "video"
  },
  {
    "name": "Clean Minimalist",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/T2V_Upscaled_00116_.webp",
    "path": "https://civitai.com/api/download/models/1735749?type=Model&format=SafeTensor",
    "scale": 1,
    "input_type": "i2v",
    "trigger_word": "",
    "type": "image"
  },
  {
    "name": "Super Saiyan Transformation",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/921498b5-99ea-4750-b950-388bcb465fd9.mp4",
    "path": "https://civitai.com/api/download/models/1554033?type=Model&format=SafeTensor",
    "scale": 1,
    "input_type": "i2v",
    "trigger_word": "5up3r super saiyan transformation",
    "type": "video"
  },
  {
    "name": "Street Fighter Hodouken",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/post.mp4",
    "path": "https://civitai.com/api/download/models/1510868?type=Model&format=SafeTensor",
    "scale": 1,
    "input_type": "i2v",
    "trigger_word": "He is lowering his body with legs wide apart and shooting a blue energy ball with two hands.",
    "type": "video"
  },
  {
    "name": "Mecha Girl - Mechabare",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/ComfyUI_00636_.webp",
    "path": "https://civitai.com/api/download/models/1543634?type=Model&format=SafeTensor",
    "scale": 1,
    "input_type": "t2v",
    "trigger_word": "mechabare, mechanical parts, robot joints, mecha musume, cyborg, android",
    "type": "image"
  },
  /*
  {
    "name": "Kanna Hashimoto",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/02.mp4",
    "path": "https://civitai.com/api/download/models/1720030?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "i2v",
    "trigger_word": "kanna",
    "type": "video"
  },
  */
  {
    "name": "Flying Effect",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/wanlora/WanVideo2_1_00010+(1).mp4",
    "path": "https://civitai.com/api/download/models/1523247?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "i2v",
    "trigger_word": "sb9527sb flying effect",
    "type": "video"
  },
  
];

export const ltxLoraModels = [
  {
    "name": null,
    "path": null,
    "scale": null,
    "trigger_word": null,
    "input_type": null,
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/webassets/none.png",
    "type": 'image'
  },
  {
    "name": "Melting | Surreal Dissolution Effects",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/upscaled_video_2.0x+(7).mp4",
    "path": "https://civitai.com/api/download/models/1778638?type=Model&format=SafeTensor",
    "scale": 1,
    "input_type": "i2v and t2v",
    "trigger_word": "Melting",
    "type": "video"
  },
  {
    "name": "Electro Surge",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/ltxv-base_00016+(1).mp4",
    "path": "https://civitai.com/api/download/models/1758090?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "i2v",
    "trigger_word": "electricity",
    "type": "video"
  },
  {
    "name": "Dream",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/LTXVideo_00074.mp4",
    "path": "https://civitai.com/api/download/models/1426312?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "i2v",
    "trigger_word": "",
    "type": "video"
  },
  {
    "name": "Slime Fall",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/ltxv-base_00002.mp4",
    "path": "https://civitai.com/api/download/models/1757759?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "i2v and t2v",
    "trigger_word": "slime pouring, slime fall, slime dripping, sticky slime",
    "type": "video"
  },
  {
    "name": "Shinkai-anime-style",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/sh1nka1-us_00016.mp4",
    "path": "https://civitai.com/api/download/models/1783229?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "t2v",
    "trigger_word": "sh1nka1 style",
    "type": "video"
  },
  {
    "name": "Cyber",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/LTXVideo_00007.mp4",
    "path": "https://civitai.com/api/download/models/1425301?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "i2v",
    "trigger_word": "",
    "type": "video"
  },
  {
    "name": "Wallace_and_Gromit style",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/walgro_style_candidate_ups_00023.mp4",
    "path": "https://civitai.com/api/download/models/1783173?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "t2v",
    "trigger_word": "Walgro style",
    "type": "video"
  },
  {
    "name": "ActionRun",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/ltxv-hd_00025.mp4",
    "path": "https://civitai.com/api/download/models/1761273?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "i2v",
    "trigger_word": "ActionRun",
    "type": "video"
  },
  {
    "name": "SuperDollyOut",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/ltxv-hd_00099+(1).mp4",
    "path": "https://civitai.com/api/download/models/1762344?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "i2v",
    "trigger_word": "SuperDollyIn",
    "type": "video"
  },
  {
    "name": "ArcRight",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/step_002000_1.mp4",
    "path": "https://civitai.com/api/download/models/1761324?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "i2v",
    "trigger_word": "ArcRight",
    "type": "video"
  },
  {
    "name": "AMGERY",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/amgery.mp4",
    "path": "https://civitai.com/api/download/models/1758577?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "i2v",
    "trigger_word": "AMGERY",
    "type": "video"
  },
  {
    "name": "Flying",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/ltxv-hd_00001.mp4",
    "path": "https://civitai.com/api/download/models/1761736?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "i2v",
    "trigger_word": "Flying",
    "type": "video"
  },
  {
    "name": "BuildingExplosion",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/ltxv-hd_00003.mp4",
    "path": "https://civitai.com/api/download/models/1761391?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "i2v",
    "trigger_word": "BuildingExplosion",
    "type": "video"
  },
  {
    "name": "EyesIn",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/ltxv-hd_00045.mp4",
    "path": "https://civitai.com/api/download/models/1761205?type=Model&format=SafeTensor&size=full&fp=fp16",
    "scale": 1.1,
    "input_type": "i2v",
    "trigger_word": "EyesIn",
    "type": "video"
  },
  {
    "name": "Arcane_Jinx",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/Nfj1nx_candidate_ups_00004.mp4",
    "path": "https://civitai.com/api/download/models/1783120?type=Model&format=SafeTensor",
    "scale": 0.6,
    "input_type": "t2v",
    "trigger_word": "csetiarcane, Nfj1nx, blue hair",
    "type": "video"
  },
  {
    "name": "Cinemagraph_no_body_moves",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/portrait_99_6k_1.0_stg1.0_[19]_ehance3_c0.97.mp4",
    "path": "https://civitai.com/api/download/models/1521950?type=Model&format=SafeTensor",
    "scale": 1,
    "input_type": "i2v",
    "trigger_word": "stationary camera, light wind, no body movement, stationary camera, light wind, slight movement",
    "type": "video"
  },
  {
    "name": "DutchAngle",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/ltxv-hd_00075.mp4",
    "path": "https://civitai.com/api/download/models/1761651?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "i2v",
    "trigger_word": "DutchAngle",
    "type": "video"
  },
  {
    "name": "Snorricam",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/ltxv-7-21_00013.mp4",
    "path": "https://civitai.com/api/download/models/1762266?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "i2v",
    "trigger_word": "Snorricam",
    "type": "video"
  },
  {
    "name": "CRANE_OVER_THE_HEAD__CRASH_ZOOM_IN",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/ltxv-hd_00031.mp4",
    "path": "https://civitai.com/api/download/models/1761528?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "i2v",
    "trigger_word": "COTHCZI",
    "type": "video"
  },
  {
    "name": "LazySusan",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/ltxv-7-21_00012.mp4",
    "path": "https://civitai.com/api/download/models/1762083?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "i2v",
    "trigger_word": "LazySusan",
    "type": "video"
  },
  {
    "name": "CarGrip",
    "video_url": "https://d3adwkbyhxyrtq.cloudfront.net/ltxlora/ltxv-hd_00035.mp4",
    "path": "https://civitai.com/api/download/models/1761498?type=Model&format=SafeTensor",
    "scale": 1.1,
    "input_type": "i2v",
    "trigger_word": "CarGrip",
    "type": "video"
  },
];

export const soundEffects = [
  { id: 1, name: 'Click', path: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/sounds/click.mp3' },
  { id: 2, name: 'Ding', path: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/sounds/ding.mp3' },
  { id: 3, name: 'Money', path: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/sounds/money.mp3' },
  { id: 4, name: 'Pop', path: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/sounds/pop.mp3' },
  { id: 5, name: 'Staple', path: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/sounds/staple.mp3' },
  { id: 6, name: 'Typing', path: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/sounds/typing.mp3' },
  { id: 7, name: 'Whoosh', path: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/sounds/whoosh.mp3' },
  
];

export const backgroundMusics = [
  { id: 1001, name: 'Another-love', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/another-love.mp3' },
  { id: 1002, name: 'Bladerunner-2049', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/bladerunner-2049.mp3' },
  { id: 1003, name: 'Constellations', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/constellations.mp3' },
  { id: 1004, name: 'Fallen', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/fallen.mp3' },
  { id: 1005, name: 'Hotline', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/hotline.mp3' },
  { id: 1006, name: 'Izzamuzzic', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/izzamuzzic.mp3' },
  { id: 1007, name: 'Nas', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/nas.mp3' },
  { id: 1008, name: 'Paris-else - Copy', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/paris-else.mp3' },
  { id: 1009, name: 'Snowfall', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/snowfall.mp3' },
  { id: 1010, name: 'a-simple-love-song-piano-ballad-in-d-major-2135', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/a-simple-love-song-piano-ballad-in-d-major-2135.mp3' },
  { id: 1011, name: 'chill-piano-inspiration-corporate-174810', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/chill-piano-inspiration-corporate-174810.mp3' },
  { id: 1012, name: 'classic-guitar-bolero-2714', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/classic-guitar-bolero-2714.mp3' },
  { id: 1013, name: 'client_public_music_another-love', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/client_public_music_another-love.mp3' },
  { id: 1014, name: 'corny-candy', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/corny-candy.mp3' },
  { id: 1015, name: 'fashion-vlog-174817', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/fashion-vlog-174817.mp3' },
  { id: 1016, name: 'flamenco-guitar-duo-flamenco-spanish-guitar-music-1614', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/flamenco-guitar-duo-flamenco-spanish-guitar-music-1614.mp3' },
  { id: 1017, name: 'for-elise-prelude-beethoven-classic-grand-piano-music-1124', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/for-elise-prelude-beethoven-classic-grand-piano-music-1124.mp3' },
  { id: 1018, name: 'inspiring-beautiful-corporate-184594', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/inspiring-beautiful-corporate-184594.mp3' },
  { id: 1019, name: 'jazz-lounge-street-food-132943', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/jazz-lounge-street-food-132943.mp3' },
  { id: 1020, name: 'loch-lomond-traditionally-scottish-musette-1310', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/loch-lomond-traditionally-scottish-musette-1310.mp3' },
  { id: 1021, name: 'pop-rock-184603', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/pop-rock-184603.mp3' },
  { id: 1022, name: 'refresher', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/refresher.mp3' },
  { id: 1023, name: 'reggae-reggae-2039', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/reggae-reggae-2039.mp3' },
  { id: 1024, name: 'rockin39-the-upright-honky-tonk-piano-blues-rock-1725', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/rockin39-the-upright-honky-tonk-piano-blues-rock-1725.mp3' },
  { id: 1025, name: 'rush-hour-piano-music-soul-style-1773', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/rush-hour-piano-music-soul-style-1773.mp3' },
  { id: 1026, name: 'shaaby-oriental-music-1974', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/shaaby-oriental-music-1974.mp3' },
  { id: 1027, name: 'the-lonesome-cowboy-pedal-steel-guitar-country-music-2849', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/the-lonesome-cowboy-pedal-steel-guitar-country-music-2849.mp3' },
  { id: 1028, name: 'unplugged-acoustic-guitar-ballad-2145', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/unplugged-acoustic-guitar-ballad-2145.mp3' },
  { id: 1029, name: 'upbeat-inspiring-guitar-pop-184608', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/upbeat-inspiring-guitar-pop-184608.mp3' },
  { id: 1030, name: 'uplifting-and-beautiful-motivational-corporate-184609', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/uplifting-and-beautiful-motivational-corporate-184609.mp3' },
  { id: 1031, name: 'zither-polka-alpenmusik-music-from-the-alps-1394', url: 'https://d3adwkbyhxyrtq.cloudfront.net/static/public/music/zither-polka-alpenmusik-music-from-the-alps-1394.mp3' },
];

export const transitionEffects = [
  { id: 1, name: 'No Animation', image: '/no.svg', value:"" },
  { id: 2, name: 'Film burn', image: '/fire.svg',value:"transitions/filmburn.mp4" },
  { id: 3, name: 'Film burn 2', image: '/fire.svg',value:"transitions/filmburn-2.mp4" },
  { id: 4, name: 'Film broll', image: '/camera.svg',value:"transitions/film-broll.mp4" },
  { id: 5, name: 'Vintage', image: '/film.svg',value:"transitions/vintage.mp4" },
  { id: 6, name: 'Glitch', image: '/computer.svg',value:"transitions/glitch.mp4" },
  { id: 7, name: 'Zoom out', image: '/zoom-out.svg',value:"" },
  { id: 8, name: 'Zoom fast', image: '/zoom-fast.svg',value:"" },
  { id: 9, name: 'Comic', image: '/comic.svg',value:"transitions/comic.mp4" },
  { id: 10, name: 'Zoom slow', image: '/zoom-slow.svg',value:"" },
  
];

export const aiStyles = [
  {style: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/none.png', name: null},
  {style: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_styles/cinematic.jpg', name: 'cinematic'},
  {style: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_styles/photographic.jpg', name: 'photographic'},
  {style: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_styles/digital-art.jpg', name: 'digital art'},
  {style: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_styles/fantasy-art.jpg', name: 'fantasy art'},
  {style: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_styles/3d-model.jpg', name: '3d model'},
  {style: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_styles/neon-punk.jpg', name: 'neon punk'},
  {style: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_styles/analog-film.jpg', name: 'analog film'},
  {style: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_styles/anime.jpg', name: 'anime'},
  {style: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_styles/cartoon.jpg', name: 'cartoon'},
  {style: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_styles/comic-book.jpg', name: 'comic book'},
  {style: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_styles/craft-clay.jpg', name: 'craft clay'},
  {style: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_styles/isometric.jpg', name: 'isometric'},
  {style: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_styles/line-art.jpg', name: 'line art'},
  {style: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_styles/low-poly.jpg', name: 'low poly'},
  {style: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_styles/origami.jpg', name: 'origami'},
  {style: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_styles/pixel-art.jpg', name: 'pixel art'},
  {style: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_styles/playground.jpg', name: 'playground'},
  {style: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_styles/texture.jpg', name: 'texture'},
  {style: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_styles/watercolor.jpg', name: 'watercolor'},
];

export const aiStoryCharacters = [
  {
    "id": null,
    "name": null,
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/webassets/none.png",
    "trigger_word": null,
  },
  {
    "id": "vadooai:2@1",
    "name": "Character 1",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/storycharacters/asian_woman.png",
    "trigger_word": "vadooch2",
  },
  {
    "id": "vadooai:6@1",
    "name": "Character 2",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/storycharacters/asian_man.png",
    "trigger_word": "vadooch6",
  },
  {
    "id": "vadooai:1@1",
    "name": "Character 3",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/storycharacters/white_woman.png",
    "trigger_word": "",
  },
  {
    "id": "vadooai:4@1",
    "name": "Character 4",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/storycharacters/white_man.png",
    "trigger_word": "vadooch4",
  },
  {
    "id": "vadooai:3@1",
    "name": "Character 5",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/storycharacters/black_woman.png",
    "trigger_word": "vadooch3",
  },
  {
    "id": "vadooai:5@1",
    "name": "Character 6",
    "image_url": "https://d3adwkbyhxyrtq.cloudfront.net/storycharacters/black_man.png",
    "trigger_word": "vadooch5",
  },
];

export const presetHeadshots = [
  {
    name: "Professional",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Professional.png",
    description: "Boost your online presence with the Professional Headshots AI Generator — a powerful tool that creates high-quality headshots in just seconds.",
    prompt: "A portrait-style image features a young man with fair skin and short, neatly styled brown hair. He has light eyes and a subtle, neutral expression. He is wearing a light gray suit jacket over a crisp white collared shirt that is unbuttoned at the top. The background is a solid, deep black, which creates a strong contrast and emphasizes the subject. The lighting is focused on the man, illuminating his face and upper body, with soft shadows providing definition. The overall mood is professional and sophisticated.",
  },
  {
    name: "Swimsuit",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Swimsuit.jpg",
    description: "Create eye-catching swimsuit images with AI! Just enter your prompt and let our AI design a personalized beach scene — from tropical escapes to beach volleyball vibes. Design your custom swimsuit image online, totally free!",
    prompt: "A young woman with long, wavy brown hair and tanned skin is standing on a sandy beach, facing the camera. She is wearing a delicate white lace bikini and has a white and yellow frangipani flower tucked behind her ear. The background shows a bright, sunny tropical beach scene with turquoise water, gentle waves, and blurred palm trees.",
  },
  {
    name: "Christmas",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Christmas.png",
    description: "Celebrate the season with our AI-powered Christmas image generator! Enter your prompt and watch as AI brings your holiday vision to life — from twinkling lights to snowy scenes. Create festive Christmas images for free with AI!",
    prompt: "A full shot captures a fair-skinned woman with long, wavy blonde hair, styled to fall over her shoulders, standing confidently in front of a decorated Christmas tree. She is wearing a sleeveless, floor-length evening gown in a deep burgundy color. The dress features intricate gold beading and embellishments that create a decorative pattern down the front, cinching at the waist and flowing out into a soft, voluminous skirt with a slight train. The bodice has a plunging V-neckline. The Christmas tree behind her is lush and full, adorned with numerous gold-colored ornaments and warm white string lights that are illuminated. The tree is positioned indoors, likely in a home or event space suggested by the festive yet possibly formal setting. To the left and right of the tree, partially visible, are lit white taper candles in ornate gold candle holders. Red poinsettia flowers with dark green leaves are arranged at the base of the Christmas tree, adding to the festive ambiance. The floor features a patterned rug. Soft light emanates from the candles and Christmas lights, creating a warm and celebratory atmosphere, fitting for a holiday season.",
  },
  {
    name: "GTA VI: High Tide Pursuit",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/GTA+VI+High+Tide+Pursuit.png",
    description: "Unleash high-speed mayhem! With our AI-powered GTA VI: High Tide Pursuit generator, you can design action-packed scenes inspired by Vice City — think neon-soaked chases, speedboats tearing through water, and explosive coastal battles.",
    prompt: "A profile shot captures a tanned woman with long, dark wavy hair flowing behind her as she speeds across the water on a bright pink and white jet ski. She is wearing a black bikini and dark sunglasses, looking focused on where she is heading. The jet ski is kicking up white spray from the water. In the background, a cityscape with numerous modern high-rise buildings is visible under a clear, sunny sky. The sun appears to be setting or rising on the horizon, casting a warm glow. The water is a deep blue, contrasting with the vibrant pink of the jet ski and the lighter sky. The overall scene conveys a sense of speed, adventure, and a sunny day on the water near a large city.",
  },
  {
    name: "Met Gala",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Met+Gala.png",
    description: "Strike a pose for the spotlight! Our AI-powered Met Gala generator transforms your prompt into a dazzling red-carpet moment — flashing cameras, couture fashion, and all the glam. Create stunning Met Gala scenes online for free with AI!",
    prompt: "A glamorous, wide-angle shot captures a fair-skinned woman with voluminous, styled blonde hair as the central figure on a grand staircase. She exudes confidence, with her hands placed on her hips and a direct gaze. She is wearing an elaborate, pale pink couture gown featuring a heavily embellished bodice with delicate detailing and dramatically oversized, ruffled sleeves and cascading layers that extend down the staircase. Her legs are bare, suggesting a high-cut design beneath the voluminous skirt layers. She is also wearing elegant, light-colored high-heeled shoes. The setting is a luxurious, ornate interior, likely a grand hall or theater, with a wide, curving staircase covered in a rich red carpet. The staircase is lined with an intricate gold railing. Behind the woman and along the sides of the staircase, numerous people dressed in formal attire (mostly black tuxedos for men and elegant dresses for women) are visible, some holding cameras and recording equipment, suggesting a red carpet event, a premiere, or a fashion show. The architecture is classical, with ornate moldings, arched doorways, and warm lighting enhancing the opulent atmosphere. The overall scene is one of high fashion, celebrity, and grandeur.",
  },
  {
    name: "New Avengers",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/New+Avengers.png",
    description: "Step into your superhero era! The AI-powered New Avengers generator creates epic, high-res portraits with futuristic armor, glowing effects, and cinematic settings. Upload a selfie and transform into the next legendary hero.",
    prompt: "A full-shot image captures a fair-skinned woman with long, wavy blonde hair, walking confidently down a city street at night. She is the central focus, positioned in the middle of the frame and facing the viewer. The woman is wearing a sleek, form-fitting black outfit that appears to be made of a shiny, possibly leather-like material. The outfit features long sleeves, gloves, a belt with a geometric buckle, and boots with decorative heart-shaped accents near the calves. A small cutout detail is visible on her left shoulder, and a subtle opening with a zipper is present at the neckline. Bright, electric purple energy emanates from her hands, creating a dynamic and powerful visual effect. The street is wet, reflecting the ambient lights of the city, which include neon signs and the headlights of parked and moving cars lining both sides of the road. The overall color palette is cool, dominated by shades of blue, purple, and black from the night scene, contrasted by the bright purple energy. The buildings in the background are blurred, suggesting a shallow depth of field that keeps the focus sharply on the woman. The atmosphere suggests a scene of fantasy or science fiction, with the woman appearing to possess or be generating electrical powers.",
  },
  {
    name: "Action Figure",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Action+Figure.png",
    description: "Turn yourself into a lifelike collectible! Generate realistic toy-style portraits in retro packaging, complete with personality props and cozy details. Dive into the AI action figure craze and create your one-of-a-kind digital figure.",
    prompt: "A product shot presents a collectible action figure set within its cardboard packaging. The central figure is a young man with short, tousled brown hair, appearing to be fair-skinned. He is dressed in a tan multi-pocket vest over a light-colored long-sleeved shirt, khaki cargo shorts, tan socks, and brown hiking boots. He wears a brown belt and a watch on his left wrist. The figure is positioned in the center of a molded black plastic tray that also holds various miniature accessories. To the left of the figure are a light green thermos mug, a beige canvas bag with a red flower embroidery, and a set of small binoculars with a compass. To the right are a white ceramic mug, a small wooden mallet or hammer with a crescent-shaped tool, and a miniature diorama featuring two small animal figures (possibly armadillos) on and around a small, round wooden table. The cardboard packaging is light brown with visible seams and edges, giving it a natural, unpolished look. The overall impression is of a safari or explorer-themed toy set.",
  },
  {
    name: "Bikini",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Bikini.png",
    description: "Soak up the sunshine with our AI-powered bikini image generator! Enter your prompt and let AI design beautiful beachside scenes with bold swimsuits and clear skies. Create bikini-themed images for free with just a few clicks!",
    prompt: "A close-up, slightly high-angle shot captures a young woman with warm brown skin and dark, curly hair pulled back loosely. Her expression is friendly and she is smiling, looking directly at the camera. She is wearing an orange bandeau bikini top and matching bikini bottoms. Her arms are extended outwards, hands gripping black handlebars, suggesting she is riding something like a jet ski or personal watercraft. The background is a vibrant turquoise sea with white foamy trails extending behind her, indicating movement. The horizon line shows a blend of a partly cloudy sky with hues of blue, white, and the warm colors of either sunrise or sunset. The lighting is bright and sunny, casting soft shadows. The overall mood is one of joy, freedom, and tropical vacation.",
  },
  {
    name: "Studio Ghibli",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Studio+Ghibli.png",
    description: "Step into the whimsical world of Studio Ghibli with our AI-powered image generator! From Spirited Away to My Neighbor Totoro, create scenes inspired by your favorite films. Just type your prompt and let AI bring the magic to life — free and effortless.",
    prompt: "A Studio Ghibli-style illustration features a young woman with short, slightly messy brown bob hair and soft bangs framing her face, large, expressive brown eyes, and smooth, fair skin, standing indoors. She is casually dressed in a plain olive green t-shirt with a gentle v-neck and light blue denim jeans. Her hands are gently placed on a light-colored wooden surface in front of her. The background depicts a cozy and softly lit interior space reminiscent of Ghibli's detailed environments. To the left, a large window with a wooden frame and multiple small panes reveals a subtly blurred outdoor scene, suggesting a peaceful day outside. A simple glass vase holding a small, leafy green plant rests on the wooden windowsill. The walls are painted in a warm, muted beige or light cream tone. In the blurred background to the right, elements of a room are suggested, including warm-toned wooden furniture, possibly kitchen cabinets or a shelf, and another small potted plant. A framed piece of artwork with elegant, dark calligraphy (reminiscent of East Asian script) hangs on the wall behind the woman. The lighting is soft and diffused, creating a gentle and serene atmosphere characteristic of Studio Ghibli films.",
  },
  {
    name: "Sakura",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Sakura.jpg",
    description: "Embrace cherry blossom season with our AI-powered Sakura image generator! Enter your prompt and watch as AI paints a picture of blooming trees, spring festivals, and peaceful moments. Generate breathtaking Sakura scenes online with ease.",
    prompt: "A whimsical image features a fair-skinned woman with long, flowing blonde hair, styled with soft waves. She has a gentle smile and appears to be in a serene, natural setting. She is adorned with delicate, translucent pink fairy wings. She is wearing a flowing, light pink kimono-style dress with subtle floral embroidery, cinched at the waist with a simple sash. The background is softly blurred, showing a garden or forest with cherry blossom trees in full bloom, indicated by the pink petals and branches. The lighting is warm and ethereal, suggesting either early morning or late afternoon light filtering through the trees. The overall mood is dreamy, magical, and peaceful.",
  },
  {
    name: "Valentine Week",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Valentine+Week.png",
    description: "Celebrate romance with our AI-powered Valentine Week image generator! Enter your prompt and let AI create dreamy scenes — from roses to candlelit dinners. Make heartwarming Valentine images online for free, effortlessly.",
    prompt: "A portrait-style image captures a young woman with fair skin and long, wavy brown hair with blonde highlights. She has light-colored eyes and a neutral expression, looking directly at the camera. She is wearing a soft, pink knitted sweater. In her hands, she holds a lush bouquet of vibrant red roses with visible green leaves. The background is a solid, uniform light pink color, which creates a soft and romantic backdrop, emphasizing the woman and the roses. The lighting is even and soft, minimizing harsh shadows.",
  },
  {
    name: "Singles Awareness Day",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Singles+Awareness+Day.jpg",
    description: "Own your independence with our AI-powered Singles Awareness Day generator! Type your prompt and let AI create empowering, self-love-focused scenes. Celebrate solo strength and individuality with free AI-generated images.",
    prompt: "A close-up, slightly angled shot features a fair-skinned young woman with long, straight blonde hair, adorned with a sparkling silver tiara. She has a warm, genuine smile and is looking directly at the viewer. She is wearing a strapless yellow dress and a delicate silver necklace with a light blue pendant. In her right hand, she holds a stemmed champagne glass filled with a pale liquid, suggesting a celebratory mood. Her nails are painted a bright red. She is sitting on a plush, light pink or white furry surface, possibly a soft chair or a bed, with a few out-of-focus white candles with warm orange flames visible in the foreground, adding a cozy ambiance. Behind her, a teal or light blue wall serves as the backdrop. On the wall, a pink neon sign illuminates the words 'Solo and Proud'. To the left, partially visible, is a vase with soft pink roses. The lighting is soft and diffused, creating a cheerful and celebratory atmosphere within a comfortable indoor setting.",
  },
  {
    name: "New Year",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/New+Year.png",
    description: "Kick off the countdown in style with our AI-powered New Year’s Eve image generator! Enter your prompt and let AI craft festive scenes with fireworks, champagne, and celebration. Create dazzling New Year images online — for free!",
    prompt: "A lively night scene in a brightly lit city square features a fair-skinned woman with long, wavy blonde hair as the central focus. She is smiling and looking towards the viewer, holding a champagne flute filled with a light-colored beverage aloft in her right hand. In her left hand, she holds a bottle of champagne with a gold foil wrapper. She is wearing a vibrant yellow two-piece outfit consisting of a cropped blazer-style jacket and a matching skirt. The background is bustling with blurred figures of people celebrating, suggesting a festive atmosphere, possibly a New Year's Eve celebration. The scene is illuminated by numerous bright lights from billboards and buildings, casting a warm glow. Fireworks are exploding in the night sky, adding to the celebratory mood. Confetti or small light particles are scattered throughout the air, further enhancing the festive feel of the urban environment. The overall ambiance is energetic, joyful, and celebratory.",
  },
  {
    name: "Rich Lifestyle",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Rich+Lifestyle.png",
    description: "Experience luxury with our AI-powered rich lifestyle generator! Type your prompt and our AI creates elegant scenes — from opulent mansions to exotic escapes. Design high-end lifestyle visuals online, completely free.",
    prompt: "A luxurious interior scene captures a woman with tan skin and long, dark wavy hair, elegantly seated on a cream-colored sofa. She is wearing a sophisticated black evening gown with a detailed bodice and a voluminous, flowing skirt. She also sports a sparkling statement necklace and earrings. The setting is an opulent room with tall windows that offer a nighttime view of a sprawling cityscape, prominently featuring a tall, iconic skyscraper in the distance (reminiscent of the Empire State Building). The room is decorated with ornate details, including a large, multi-tiered crystal chandelier hanging from the ceiling, tall marble columns with gold accents, and plush curtains framing the windows. The floor is made of polished marble with intricate patterns. A lamp with a warm glow is visible on a side table, and another sofa with pink flowers on a nearby table is partially in view. The overall atmosphere is one of elegance, wealth, and sophistication, with a stunning urban backdrop visible through the windows.",
  },
  {
    name: "Giftcard",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Giftcard.png",
    description: "Design the perfect personalized gift card with our AI-powered generator! Just enter your prompt, and AI will create a stunning, one-of-a-kind image for any occasion. No design skills needed — make memorable, custom AI gift cards with ease.",
    prompt: "A medium shot captures a fair-skinned woman with long, wavy brown hair, lightly dusted with falling snow, as she stands outdoors in a festive, wintry setting. She has a serious yet soft expression, looking slightly off-center. She is wearing a vibrant red winter coat with a dark brown fur collar, layered over a black turtleneck sweater. In her hands, she gently holds two neatly wrapped Christmas gifts stacked on top of each other. The larger box at the bottom is wrapped in brown paper, while the smaller box on top is also in brown paper. Both are tied with delicate gold string and red ribbon. To her left, a decorated Christmas tree is partially visible, adorned with warm white string lights and numerous gold-colored ornaments. The lights create a soft, bokeh effect in the background. The surroundings suggest a charming outdoor market or street with buildings blurred in the background, some showing warm light emanating from within. Snowflakes are gently falling, creating a magical and holiday-themed atmosphere. The overall color palette is rich with the red of the coat contrasting against the white snow and the warm tones of the Christmas decorations and background lights.",
  },
  {
    name: "Urban",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Urban.jpg",
    description: "Bring city life to your screen with our AI-powered urban scene generator! Type your prompt and AI generates stunning visuals — from gritty street corners to glowing skylines. Create free city-inspired images online with AI.",
    prompt: "A medium shot features a young woman with light brown hair, styled with subtle waves and lighter highlights, leaning slightly against a brightly colored wall. She has a neutral yet confident expression, looking directly at the camera. She is wearing a dark blue, satin-like midi dress with long, slightly flared sleeves, a defined waist cinched by a gold buckle belt, and gold button details down the front. The wall behind her is divided into vertical sections of vibrant colors: a soft pastel yellow on the left, a muted dusty rose in the center, and a bright sky blue on the right. To the left of the woman, a window with white metal bars is visible, set into a light-colored or weathered wall. The lighting appears to be natural daylight, casting soft shadows and highlighting the texture of the dress and the wall. The setting suggests an outdoor urban environment with a focus on the colorful architecture and the stylishly dressed woman.",
  },
  {
    name: "Europe Travel",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Europe+Travel.jpg",
    description: "Discover Europe through AI-generated imagery! Enter your prompt and let our generator craft custom travel scenes — from Paris to the Amalfi Coast. Explore Europe visually for free with our AI-powered travel image tool.",
    prompt: "A slightly low-angle, medium shot captures a young woman with light brown hair, wearing a wide-brimmed straw hat adorned with an orange ribbon, and a delicate white sundress with thin straps. She has a soft, neutral expression and is looking directly at the camera. The background features a sun-drenched outdoor setting, possibly a garden or courtyard. To the left, a stone fountain with multiple tiers is actively spraying water, creating a sparkling effect in the sunlight. Lush green foliage and trees are visible in the blurred background, suggesting a natural and serene environment. Behind the woman to the right, a weathered stone building covered in climbing vines is partially visible, hinting at old-world charm or a historical location. The lighting is bright and sunny, casting soft shadows and highlighting the texture of her hat and dress. The overall atmosphere is relaxed, summery, and picturesque.",
  },
  {
    name: "Cyberpunk",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Cyberpunk.jpg",
    description: "Dive into a neon-drenched future with our AI-powered cyberpunk image generator! Enter your prompt and create high-tech, dystopian cityscapes bursting with color and energy. Make cyberpunk art online for free with just a click.",
    prompt: "A medium shot captures a young woman with fair skin and shoulder-length hair that is blonde at the roots, transitioning to vibrant pink and blue streaks. She has a serious expression and is looking directly at the camera. She is wearing a white tank top with red lettering (partially obscured but appears to say 'FULL'), a black leather jacket with a silver zipper, and blue denim jeans with her midriff slightly exposed. She is standing on a dimly lit city street at night. The street is lined with older, somewhat weathered buildings with neon signs in red, yellow, and blue, illuminating the storefronts. Cars are parked along the side of the street. The sky is a dark, cloudy twilight. Streetlights cast a muted glow, and wires crisscross overhead. The overall atmosphere is urban, slightly edgy, and suggests a cool, evening setting.",
  },
  {
    name: "Tropical",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Tropical.jpg",
    description: "Escape to paradise with our AI-powered tropical image generator! Input your prompt and AI will conjure lush beaches, palm trees, and exotic wildlife. Create your dream getaway scenes online — absolutely free.",
    prompt: "A slightly low-angle medium shot captures a fair-skinned young woman with long, wavy blonde hair, partially braided at the crown, leaning against a large tree trunk. She has a soft, serene expression and is looking directly at the camera. She is wearing a sleeveless teal dress adorned with a vibrant floral print featuring pink, yellow, and white blossoms, and subtle ruffle details along the neckline and armholes. The background is a softly blurred forest scene with tall, slender trees bathed in dappled sunlight filtering through the leaves, creating a bokeh effect. A dirt path curves gently into the background to the left of the woman. The overall lighting is bright and natural, suggesting a sunny day in the woods. The atmosphere is peaceful, natural, and slightly ethereal.",
  },
  {
    name: "Fitness",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Fitness.jpg",
    description: "Show off your strength with our AI-powered fitness image generator! Build a model of yourself and generate powerful photos that capture your physique and dedication. Highlight your fitness journey in high-quality visuals, effortlessly.",
    prompt: "A medium shot features a woman with warm brown skin and long, wavy brown hair, standing confidently in a gym setting. She is wearing a light grey and white striped sports bra and high-waisted light grey leggings. Her hands rest lightly on a barbell loaded with black weight plates, which is positioned horizontally in the foreground. She is looking directly at the camera with a slight smile. The background of the image shows a well-equipped gym with various exercise machines and free weights. Rows of dumbbells on racks are visible behind her to the right. Large windows letting in natural light are visible in the background to the left, suggesting a daytime setting. The overall atmosphere is clean, well-lit, and fitness-oriented.",
  },
  {
    name: "Astronaut",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Astronaut.jpg",
    description: "Launch into space with our AI-powered astronaut image generator! Enter your prompt and watch as AI crafts breathtaking interstellar scenes — from starry skies to alien planets. Create cosmic visuals for free with just a few clicks!",
    prompt: "A medium shot features a fair-skinned man with short, dark hair and a serious expression, wearing a white and detailed astronaut spacesuit. The helmet is not visible, allowing his face to be seen. The spacesuit has an American flag patch prominently displayed on the shoulder. He appears to be kneeling or crouching on a reddish, rocky terrain, suggestive of the surface of Mars. The background shows a dark sky filled with stars and a large, pale, cratered moon or planet in the upper left corner. The overall lighting suggests a somewhat dim environment with highlights on the astronaut's suit and the Martian landscape. The scene conveys a sense of exploration and solitude in a desolate, extraterrestrial environment.",
  },
  {
    name: "Street Style",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Street+Style.jpg",
    description: "Show off your fashion flair with our AI-powered street style image generator! Type your prompt and let AI design trendy urban scenes — from city backdrops to eye-catching outfits. Create stylish streetwear visuals online, totally free.",
    prompt: "A medium shot features a young woman with light Asian features and shoulder-length dark hair with streaks of pink and blue. Her hair is partially tied up in a messy ponytail. She has a neutral expression and is looking slightly off-center. She is wearing a white long-sleeved shirt with graphic blue and pink lettering, and a large, circular, textured blue earring on her left ear. Multiple tattoos are visible on her neck and arms, including script and floral designs. She is wearing rings on her fingers and a layered necklace. She is standing in a narrow alleyway at night. The alley walls are brick and covered in graffiti. A warm yellow light emanates from a fixture above and behind her, casting shadows and illuminating the textures of the alley. The background is slightly blurred, suggesting a shallow depth of field, keeping the focus on the woman. The overall atmosphere is urban, edgy, and artistic.",
  },
  {
    name: "Twilight",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Twilight.png",
    description: "Capture the calm of golden hour with our AI-powered twilight image generator! Input your prompt and our AI creates dreamy dusk landscapes — from soft sunsets to starlit skies. Create magical twilight scenes online for free!",
    prompt: "A medium shot features a young woman with tan skin and long, wavy brown hair, standing amidst tall pine trees in a forest. She has a serious yet serene expression and is looking directly at the camera. She is wearing a long, flowing white dress with a lace-trimmed neckline and sleeves, cinched at the waist with a simple tie belt. A delicate necklace adorns her neck. The forest setting is slightly misty or foggy, creating a soft and diffused light that filters through the tall, dark tree trunks and green foliage. The ground is covered in fallen pine needles and soft undergrowth. The perspective is slightly low-angle, making the trees appear tall and imposing. The overall atmosphere is tranquil, slightly mysterious, and connected to nature.",
  },
  {
    name: "Soccer",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Soccer.jpg",
    description: "Feel the thrill of the pitch with our AI-powered soccer image generator! Enter your prompt and let AI build dynamic scenes — from roaring crowds to soccer heroes. Create soccer-themed visuals online, free and easy.",
    prompt: "A dynamic medium shot captures a male soccer player with short dark hair and a beard, in motion on a green soccer field. He is wearing an orange jersey with dark blue accents and a team logo on the chest, dark blue shorts with a logo on the leg, orange socks, and bright lime green soccer cleats. His body is angled slightly to the left as he kicks a black and white soccer ball with his right foot. His arms are extended for balance as he focuses on the ball. In the blurred background, other players in similar uniforms and a grassy field under bright daylight are visible, suggesting a soccer match or practice. The overall impression is one of action, athleticism, and a sunny day on the soccer field.",
  },
  {
    name: "Pirate",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Pirate.jpg",
    description: "Set sail with our AI-powered pirate scene generator! Just type your prompt and watch AI craft adventurous worlds — treasure hunts, ships, and swashbucklers galore. Create pirate-themed images online for free!",
    prompt: "A dramatic, eye-level shot features a woman dressed as a pirate, confidently standing at the helm of a ship during a stormy sea. She has long, dark, windswept hair, tan skin, and is wearing a traditional dark blue pirate hat with gold trim and a feather, a red bandana, a partially unbuttoned white shirt, a dark blue vest or bodice, and a wide brown belt with a large ornate buckle. Gold epaulets adorn her shoulders. She is holding the wooden spokes of the ship's wheel with both hands. The background shows a turbulent, dark blue sea with whitecaps, under a stormy, grey sky with flashes of lightning illuminating the scene. Thick ropes are visible extending upwards from the ship's wheel. The overall atmosphere is adventurous, slightly dangerous, and conveys a sense of maritime peril and the strength of the pirate captain.",
  },
  {
    name: "Cinematic",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Cinematic.jpg",
    description: "Bring the silver screen to life with our AI-powered cinematic scene generator! Type your prompt and let AI create movie-inspired visuals — from iconic characters to dramatic sets. Make Hollywood-style images for free, instantly.",
    prompt: "A full-length shot captures a woman with East Asian features and long, wavy brown hair, elegantly posing on a stone balcony or terrace. She is wearing a striking, deep red, floor-length coat dress with a plunging neckline, long sleeves, defined shoulders, and a wide belt with a prominent buckle cinching her waist. The dress features pleats and flows dramatically around her, creating a sense of movement and sophistication. She is wearing dark, pointed heels. The background reveals a scenic vista at dusk or dawn. A large, stately building with a classic architectural style, featuring multiple columns and a grand facade, is visible in the middle ground, surrounded by expansive green lawns and trees. The sky behind is a gradient of warm colors, ranging from a soft orange and yellow near the horizon where the sun is setting or rising, to deeper hues of purple and grey higher up. The overall lighting is soft and atmospheric, casting a warm glow on the woman and the landscape, creating a romantic and majestic scene. The setting appears to be a historic estate or palace grounds.",
  },
  {
    name: "Glamour",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Glamour.jpg",
    description: "Turn up the elegance with our AI-powered glamour lifestyle generator! Type your prompt and let AI design luxurious scenes — high fashion, sparkling interiors, and opulence. Create chic lifestyle images online, completely free.",
    prompt: "A full-length shot captures a woman with tanned skin and long, wavy brown hair, elegantly dressed in a light blue, floor-length prom dress. The dress features a deep V-neckline adorned with intricate silver beading and embellishments. The bodice is fitted, and the skirt flows out into a soft, voluminous tulle fabric with a long train. A high slit on the left leg adds a touch of glamour. She is wearing silver high-heeled sandals. The setting is an indoor space with soft, natural light streaming in from a large window to the left, casting a gentle shadow on the white wall behind her. The floor is a light, neutral color, providing a clean and elegant backdrop that highlights the dress. The overall mood is sophisticated and graceful.",
  },
  {
    name: "Ocean Getaway",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Ocean+Getaway.jpg",
    description: "Sail into style with our AI-powered cruise scene generator! Enter your prompt and let AI craft stunning images — models on deck, ocean views, and luxury vibes. Use presets or start from scratch — no design skills needed. Free and online!",
    prompt: "A high-angle, close-up shot captures a handsome, fair-skinned man with tousled brown hair and wearing dark sunglasses. He is seated on the wooden deck of a boat, facing the camera with a relaxed and slightly brooding expression. He is wearing a partially unbuttoned white short-sleeved shirt, revealing his toned torso, and white pants. Multiple silver necklaces adorn his neck, and he is wearing a watch on his left wrist. Behind him, the turbulent blue-green water churns with white foamy wakes created by the moving boat. The sunlight is bright, reflecting off the water and highlighting the texture of the wooden deck. The overall scene exudes a sense of luxury, leisure, and being on a fast-moving boat in open water given the likely warm climate and coastal setting.",
  },
  {
    name: "Black Friday",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Black+Friday.jpg",
    description: "Fuel your holiday sales with our AI-powered Black Friday image generator! Enter your prompt and let AI create bold visuals — perfect for ads, promos, and social posts. Generate marketing images online, fast and free.",
    prompt: "A medium shot captures a young woman with fair skin and long, wavy blonde hair, walking through a brightly lit indoor shopping mall. She has a soft, slightly contemplative expression and is looking slightly off to the side. She is wearing a tan suede jacket, a white top, and blue jeans, with a black backpack slung over her shoulder. She is holding a small red shopping bag in her right hand. The background of the mall is filled with blurred figures of other shoppers and brightly illuminated storefronts. Rows of warm, orange-toned lights hang overhead, creating a bokeh effect, along with cooler blue and white lights, suggesting a festive or decorative lighting scheme. The overall atmosphere is bustling and indicative of a busy retail environment.",
  },
  {
    name: "Bohemian Vibes",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Bohemian+Vibes.jpg",
    description: "Let your spirit roam with our Bohemian Vibes AI image generator! Create earthy, relaxed headshots inspired by free-spirited fashion and lifestyle — all powered by AI and totally free.",
    prompt: "A medium shot features a young woman with warm brown skin and long, wavy brown hair, wearing a light brown floppy hat. She has a gentle smile and is looking directly at the camera. She is dressed in a bohemian style with a cream-colored maxi dress featuring a colorful patterned hem in shades of red and blue, layered with a light blue denim jacket. She accessorizes with multiple necklaces and bracelets, adding to the relaxed, free-spirited vibe often associated more laid-back areas. The background shows a rustic outdoor setting, possibly. To her left, a weathered wooden barn or shed with open double doors is partially visible. Behind her to the right, a vintage light yellow and green Volkswagen van with luggage strapped to the roof is parked on the grassy ground. Lush green grass and trees fill the background, suggesting a sunny day in a natural, possibly slightly remote location. The overall atmosphere is peaceful, outdoorsy, and evokes a sense of travel and a relaxed, bohemian lifestyle, which can be found in certain artistic or nature-oriented communities around.",
  },
  {
    name: "Cyborg Theme",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Cyborg+Theme.png",
    description: "Step into the future with our Cyborg Theme AI image generator! Create futuristic portraits where human meets machine — with sleek, high-tech vibes. AI-powered headshots, free and easy.",
    prompt: "A close-up portrait shot features a young man with fair skin and short, dark, slightly curly hair. He has a serious and determined expression, looking directly at the camera. He is wearing a futuristic, armored suit in shades of dark grey and black, with glowing blue accents on the chest, shoulders, and arms. The armor appears functional and technologically advanced, fitting for a science fiction or cyberpunk setting within an imagined futuristic cityscape. The background is blurred but suggests a rainy, neon-lit urban environment at night. Vertical streaks of red and yellow light from signs or buildings are visible, along with other indistinct glowing lights, indicative of a bustling, high-tech city center in a future. Rain appears to be falling, with streaks visible in the out-of-focus areas. The overall atmosphere is gritty, futuristic, and conveys a sense of a technologically advanced urban landscape.",
  },
  {
    name: "Diwali Celebration",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Diwali+Celebration.jpg",
    description: "Celebrate the festival of lights with our Diwali AI image generator! Create vibrant, festive portraits using AI-powered headshots — perfect for capturing the joy and color of Diwali.",
    prompt: "A warm, medium shot captures a young woman with tan skin and long, dark wavy hair, holding a lit sparkler in both hands. She is looking softly towards the left with a gentle expression. She is wearing a traditional Indian outfit, likely a red and gold embellished salwar kameez or saree, and adorned with ornate gold jewelry, including a heavy necklace and dangling earrings. The background is softly blurred but shows a festive nighttime scene, likely a Diwali celebration. Numerous small oil lamps or diyas are lit, creating warm, glowing spots of light. Colorful string lights in shades of yellow, red, and blue are also visible, adding to the celebratory atmosphere. The overall lighting is warm and inviting, highlighting the sparkler as the main light source in the immediate foreground, and creating a bokeh effect with the background lights, typical of a festive evening.",
  },
  {
    name: "Graduation",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Graduation.jpg",
    description: "Honor your big milestone with our Graduation AI image generator! Create memorable, celebratory portraits powered by AI headshots — and relive the moment forever.",
    prompt: "A medium shot focuses on a young woman with tan skin and long, dark wavy hair, wearing a traditional blue graduation cap with a gold tassel and a blue graduation gown adorned with a gold stole. She has a serious yet proud expression, looking directly at the camera. The background is softly blurred, showing other graduates in similar caps and gowns, suggesting a graduation ceremony at an educational institution. The setting appears to be outdoors on a bright day, with green foliage and possibly buildings slightly visible in the out-of-focus background, indicative of a campus environment. The overall atmosphere is one of accomplishment, pride, and the culmination of studies at a local college or university.",
  },
  {
    name: "Halloween Theme",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Halloween+Theme.jpg",
    description: "Embrace the spooky season with our Halloween AI image generator! Create hauntingly fun portraits with AI-powered headshots — ghosts, costumes, and chills await.",
    prompt: "A medium shot features a fair-skinned man with dark, neatly styled hair, embodying the persona of Count Dracula for Halloween in what appears to be an indoor setting, possibly a decorated home or event space. He has a serious and slightly brooding expression, looking towards the left of the frame. He is dressed in a classic vampire attire, including a sharp black double-breasted suit jacket, a crisp white collared shirt, and a formal black bow tie. A vibrant red pocket square peeks out from his jacket pocket. His most striking feature is a long, flowing black cape with a dramatic, high red collar that stands up around his neck. He holds a dark, ornate cane in his right hand, while his left hand is casually placed in his pocket. The background is dimly lit with a spooky Halloween ambiance, fitting for a celebration. Visible through an arched doorway are two glowing jack-o'-lanterns with carved faces, emitting a warm orange light. Wispy white fabric, resembling cobwebs or ghostly drapery, hangs around the doorway and pumpkins, enhancing the eerie atmosphere. A warm light source, possibly from another lamp, illuminates the scene from above and behind the pumpkins. The overall mood is theatrical, gothic, and fitting for a Halloween celebration.",
  },
  {
    name: "Harry Potter Theme",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Harry+Potter+Theme.jpg",
    description: "Step into the wizarding world with our Harry Potter Theme AI generator! Create enchanting portraits with AI-powered headshots — wands, robes, and pure magic included.",
    prompt: "A young woman, possibly Saoirse Ronan, is standing indoors, in what appears to be a library or study at Hogwarts. She has fair skin and long, wavy blonde hair. She is holding an open book. She is wearing a Hogwarts uniform, including a black robe with a burgundy lining and a striped tie. The background shows a room with tall bookshelves filled with books. An arched doorway reveals a view of Hogwarts castle in the distance, with its towers and turrets visible through a window. The overall lighting is soft and atmospheric, suggesting an academic and slightly magical setting.",
  },
  {
    name: "Hobbit Avatar",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Hobbit+Avatar.jpg",
    description: "Journey to Middle-earth with our Hobbit Avatar AI generator! Create magical, fantasy-inspired portraits with AI-powered headshots — perfect for any Tolkien fan.",
    prompt: "A full shot captures a young woman with tan skin and long brown hair styled in a loose braid. She has a focused expression and is standing on a dirt path in the middle of a lush forest. She is dressed in practical, earth-toned clothing suitable for an adventure: a long-sleeved olive green top, brown capri pants, and sturdy brown boots. A brown leather belt or utility strap is cinched around her waist. The forest is dense with large, moss-covered trees creating a natural arch overhead. Sunlight filters through the canopy, casting dappled light and creating a mystical, slightly ethereal atmosphere often found in the wooded areas around. Lush green undergrowth and foliage line the sides of the path. The overall lighting suggests either early morning or late afternoon, with long shadows stretching across the path. The scene evokes a sense of exploration, natural beauty, and perhaps a touch of mystery within the landscapes.",
  },
  {
    name: "Instagram",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Instagram.jpg",
    description: "Turn heads on Instagram with our AI-generated visuals! Just enter your prompt and watch AI craft scroll-stopping posts that wow your followers. Stunning content made easy—and free!",
    prompt: "A medium shot from behind captures a young woman with fair skin and long, wavy brown hair, as she sits on the edge of a luxurious infinity pool, gazing over her left shoulder towards the camera. She is wearing a sleek black one-piece swimsuit with thin straps and a low back. Her expression is serene and slightly contemplative. The infinity pool appears to blend seamlessly with the vast expanse of the ocean stretching out before her. The water in the pool is crystal clear, reflecting the partly cloudy sky above. The horizon line shows a meeting of the turquoise sea and the light blue sky dotted with fluffy white clouds. In the distance, a coastline with lush green vegetation and a sandy beach is visible. A small structure, perhaps a villa or pavilion, sits near the beach. Palm trees are silhouetted against the sky on the right side of the frame, adding to the tropical ambiance. The lighting suggests a bright day, casting soft shadows and highlighting the woman's figure and the stunning natural scenery. The overall mood is one of tranquility, relaxation, and luxurious escape in a beautiful setting.",
  },
  {
    name: "Interstellar Muse",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Interstellar+Muse.jpg",
    description: "Launch into the cosmos with our Interstellar Muse AI image generator! Create breathtaking, space-inspired portraits using AI-powered headshots. Discover the stars in every shot.",
    prompt: "A close-up shot captures a fair-skinned man with short, dark hair and a slight beard, wearing a detailed white astronaut spacesuit with the helmet partially obscuring his face but allowing his eyes and upper face to be visible. He has a focused and serious expression, looking slightly off to the side. The spacesuit features various technical details, including straps, panels, and a patch with a circular logo on the chest. The background is dimly lit and suggests an interior setting with a computer monitor partially visible to the left, displaying glowing blue elements, possibly a loading screen or interface. Red ambient lighting illuminates the wall behind him on the right. The overall atmosphere is somewhat enclosed and technological, hinting at a simulation, training, or command center environment. The lighting creates a contrast between the bright white of the spacesuit and the darker surroundings.",
  },
  {
    name: "Mountain Trek Theme",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Mountain+Trek+Theme.jpg",
    description: "Reach new heights with our Mountain Trek AI image generator! Generate awe-inspiring photos with AI-powered headshots that capture the spirit of the great outdoors.",
    prompt: "A full shot captures a woman with East Asian features and long dark hair pulled back in a ponytail, standing on a rocky mountain trail. She is looking over her shoulder towards the viewer with a serene expression. She is wearing activewear consisting of a short-sleeved burnt orange crop top, light green capri leggings, and sturdy brown hiking boots with beige accents. The background showcases a breathtaking mountain vista. Jagged peaks rise in the distance under a bright, clear sky with the sun shining brightly, casting lens flares. The surrounding terrain is rocky and sparsely covered with vegetation, suggesting a high-altitude environment. The lighting is natural and highlights the textures of the rocks and the woman's athletic build. The overall atmosphere is one of adventure, being in nature, and enjoying a scenic mountain landscape, reminiscent of some of the hilly regions or viewpoints one might find.",
  },
  {
    name: "Music Festival",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Music+Festival.jpg",
    description: "Feel the beat with our Music Festival AI image generator! Create vibrant, high-energy portraits using AI-powered headshots that bring festival vibes to life.",
    prompt: "A selfie-style, low-angle shot captures a fair-skinned man with short, dark, spiky hair, a goatee, and a tattoo on his neck, wearing reflective blue sunglasses. He has a confident expression, looking slightly above the camera. He is wearing a sleeveless shirt revealing his tattooed arms and chest, and a red hooded vest. The background is a vibrant and energetic music festival scene. Bright stage lights in shades of blue, pink, and white illuminate a large stage setup with abstract patterns and glowing elements. A massive crowd of people is visible in a blurred state, suggesting a large and lively audience enjoying the music. The overall atmosphere is energetic, exciting, and filled with the colorful lights and energy of a large outdoor music event, which might be seen at some of the larger gatherings or cultural events.",
  },
  {
    name: "Ninja Theme",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Ninja+Theme.jpg",
    description: "Master the shadows with our Ninja Theme AI image generator! Design sleek, stealthy portraits with AI-powered headshots that channel silent warriors of legend.",
    prompt: "A medium shot features a fair-skinned woman with dark hair partially concealed by a black hooded cloak. She has a serious and focused expression, looking directly at the viewer. She is dressed in dark, ninja-like attire, including gloves and what appears to be a sword partially visible at her side. The background suggests a misty, rainy night in a traditional East Asian-style street, possibly imagined in a historical or fantasy setting, or perhaps a themed area reminiscent of such aesthetics found even within. Buildings with distinct architectural features and glowing red lanterns or signs with Asian characters line the street. Raindrops are subtly visible in the air, contributing to the atmospheric mood. The overall ambiance is mysterious, slightly ominous, and evocative of a skilled warrior or assassin in a nocturnal urban environment.",
  },
  {
    name: "Paladin Theme",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Paladin+Theme.jpg",
    description: "Channel your inner knight with our Paladin Theme AI image generator! Create noble, armor-clad portraits using AI-powered headshots that embody strength and honor.",
    prompt: "A striking medium shot features a woman with East Asian features and long, flowing blonde hair, wearing an ornate silver crown and full medieval armor. She holds a large, gleaming sword in her right hand and a detailed, round shield in her left. A light-colored cape billows behind her. She has a determined and regal expression. The background reveals a dramatic landscape with a large, ancient castle situated on a rocky hill. The sky is stormy and overcast, with rays of sunlight breaking through the clouds in the distance, suggesting a moment of hope or impending battle. The overall lighting is dramatic, emphasizing the warrior queen's presence against the imposing castle and turbulent sky, possibly evoking a sense of historical or fantasy narratives, which could resonate with storytelling traditions even within.",
  },
  {
    name: "Paris View",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Paris+View.jpg",
    description: "Fall under the spell of Paris with our AI-powered image generator! Craft romantic, dreamy portraits that capture the magic of the City of Love—all with AI headshots.",
    prompt: "A medium shot features a young woman with fair skin and long, wavy brown hair, standing confidently on a Parisian street. She has a neutral yet engaging expression, looking slightly off to the side. She is wearing a black and white horizontal striped long-sleeved shirt, a light pink pleated skirt with a brown belt, and a watch on her wrist. The background showcases a classic European city street lined with tall, narrow buildings with traditional architecture. Red awnings cover outdoor seating areas of cafes and restaurants along the sides of the street, with blurred figures of people sitting at tables or strolling by. In the distance, the iconic Eiffel Tower rises prominently under a bright, slightly hazy sky. The lighting suggests a sunny day. The overall atmosphere is chic, urban, and evokes the charm of Paris.",
  },
  {
    name: "Passport Photo",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Passport+Photo.jpg",
    description: "Prepare for your next journey with our AI-powered passport photo creator! Input a prompt and let AI generate perfect passport-style images—professional, clean, and free.",
    prompt: "A portrait shot captures a young woman with East Asian features, her dark hair styled in a neat high bun. She has a serious and professional expression, looking directly at the camera. She is wearing a dark black blazer over a light blue collared shirt. A delicate gold necklace is visible around her neck. The background is a plain, soft grey, ensuring the focus remains entirely on the subject. The lighting is even and well-distributed, minimizing harsh shadows and highlighting her features and attire. The overall impression is one of professionalism, competence, and a poised demeanor, suitable for a business portrait any other location.",
  },
  {
    name: "Onlyfans",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Onlyfans.png",
    description: "Turn up the allure with our AI-powered OnlyFans image generator! Type your prompt and let AI craft seductive portraits—from tasteful teasers to bold, exclusive visuals. Free and online.",
    prompt: "A sensual medium shot captures a fair-skinned woman with long, wavy brown hair, sitting on a bed and looking at the camera with a soft, inviting smile. She is wearing a delicate, teal-grey lace lingerie set and a casually draped dark teal or grey blazer over her shoulders. The background is softly blurred, suggesting a cozy and intimate bedroom setting. A bedside lamp with a warm glow is visible to the left, and a window letting in natural light is implied, illuminating the scene gently. The bed has neutral-toned linens. The overall atmosphere is intimate, relaxed, and alluring.",
  },
  {
    name: "AI Dating",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/AI+Dating.jpg",
    description: "Stand out on dating apps with our AI-powered dating headshot generator! Create flattering, personality-packed portraits designed to boost your profile in seconds.",
    prompt: "A medium close-up shot captures a young woman with fair skin and long, wavy brown hair, seated outdoors at what appears to be a cafe or restaurant. She has a soft, slightly pensive expression and is looking directly at the camera. She is wearing a floral print top with short sleeves and a deep V-neck, and a delicate necklace with a small light blue pendant. Sunglasses are perched atop her head. The background is softly blurred, suggesting an outdoor dining area in a sunny setting. Lush pink flowers are prominently featured, possibly climbing on a trellis or hanging in planters behind her, adding a vibrant and romantic touch to the scene, which could be a common sight in the pleasant outdoor spaces. Tables and chairs, along with indistinct figures of other patrons, are visible in the bokeh. The lighting is natural and warm, typical of a bright day highlighting the woman and the colorful floral backdrop. The overall atmosphere is relaxed and pleasant, indicative of a leisurely moment outdoors in a charming setting.",
  },
  {
    name: "Old Money",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Old+Money.png",
    description: "Capture timeless sophistication with our Old Money AI headshot generator! Craft elegant, aristocratic portraits that exude vintage class and refinement—all with the help of AI.",
    prompt: "A medium shot features a fair-skinned man with short, dark, neatly styled hair and a well-groomed mustache and beard. He is seated in a chair, facing the camera with a composed and confident expression. He is dressed in a formal three-piece suit in a dark grey or charcoal color, consisting of a jacket, vest, and trousers. He wears a light-colored dress shirt, a patterned tie in shades of brown and beige, and a dark watch on his left wrist. A neatly folded pocket square is visible in his jacket pocket. The background suggests a classic and sophisticated interior, possibly a study or a well-appointed room. The walls are paneled in a dark color, and framed artwork and a dark wooden cabinet with a lamp on top are partially visible behind him. The lighting is warm and subdued, creating an atmosphere of elegance and professionalism, suitable for a distinguished setting.",
  },
  {
    name: "YouTube Thumbnail",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/YouTube+Thumbnail.jpg",
    description: "Boost your click-through rate with custom YouTube thumbnails! Enter a prompt and let AI generate attention-grabbing visuals tailored for your channel. Fast, eye-catching, and free.",
    prompt: "A vibrant portrait captures a young woman with fair skin and striking, curly red hair styled in an updo. She has a confident and slightly flirtatious expression, looking directly at the camera. She is wearing a white crop top with thin vertical pink stripes and light blue denim jeans. Long, dangling gold earrings adorn her ears. Her hands are gracefully posed near her face and a vintage-style black microphone on a stand. The background is divided into three vertical panels of solid, bright colors: a soft pink on the left, a sunny yellow in the middle behind her face, and a lime green on the right. The lighting is bright and even, emphasizing the woman's features and the bold color blocks, creating a retro yet modern pop art feel, possibly reflective of a creative individual or a music-themed setting.",
  },
  {
    name: "Pet Companions",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Pet+Companions.jpg",
    description: "Share the love with your furry friends using our Pet Companions AI generator! Create adorable portraits of you and your pets with AI-powered headshots that celebrate companionship.",
    prompt: "A warm, outdoor shot captures a fair-skinned young woman with long, wavy blonde hair, kneeling on a sunny grassy field and affectionately embracing a medium-sized, light brown dog. The woman is smiling gently at the camera, her hands resting on the dog's back and neck. She is wearing a white tank top and dark leggings. The happy dog is looking upwards with its mouth slightly open and tongue showing, enjoying the attention. The background shows a bright, sunny day in what appears to be a park or open green space. Lush green grass covers the ground, and trees with green leaves are visible in the blurred background, suggesting a pleasant natural setting. The sky is blue with some scattered white clouds. The overall atmosphere is cheerful, wholesome, and conveys the bond between a person and their pet in a beautiful outdoor environment typical of the parks and natural areas.",
  },
  {
    name: "Safari Adventure",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Safari+Adventure.png",
    description: "Go wild with our Safari Adventure AI image generator! Create action-packed, nature-filled portraits with AI-powered headshots that transport you to the heart of the savannah.",
    prompt: "A scenic wide shot captures a fair-skinned man, appearing as a safari guide or explorer, standing in a vast, grassy plain at sunset. He is wearing a tan safari hat, a light brown button-up shirt, and holding a pair of binoculars in his left hand. He has a serious and observant expression, looking towards the left of the frame. The background is a breathtaking African savanna landscape under a vibrant sunset. The sky is ablaze with warm hues of orange, yellow, and pink. Several giraffes are grazing peacefully in the tall, dry grass, along with other distant wildlife silhouettes. Iconic flat-topped acacia trees dot the landscape, typical of the African plains. The overall lighting is warm and golden, casting long shadows and creating a silhouette effect for some of the distant animals and trees. The scene evokes a sense of adventure, wildlife observation, and the serene beauty of the African wilderness at twilight.",
  },
  {
    name: "Samurai Theme",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Samurai+Theme.jpg",
    description: "Step into ancient Japan with our Samurai Theme AI image generator! Create dignified, battle-ready portraits with AI-powered headshots inspired by warriors of old.",
    prompt: "A portrait-style shot features a woman with East Asian features and dark hair pulled back in a high bun, dressed as a samurai warrior. She has a serious yet composed expression, looking directly at the viewer. She is wearing traditional samurai armor in dark grey and black, with red accents visible on her undergarments and belt. Two swords, with their hilts detailed in gold, are sheathed at her waist. The background is softly blurred, suggesting a traditional Japanese setting, perhaps a temple or a village street on a slightly overcast day. Architectural details of Japanese buildings with tiled roofs are subtly visible. The overall atmosphere evokes a sense of strength, discipline, and historical Japanese culture, possibly reflecting an interest in martial arts or historical themes within the creative scene.",
  },
  {
    name: "Star Wars Theme",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Star+Wars+Theme.jpg",
    description: "Join the galaxy far, far away with our Star Wars Theme AI generator! Craft epic, Force-filled portraits using AI-powered headshots fit for a Jedi or Sith.",
    prompt: "A heroic medium shot portrays a young man with fair skin and flowing brown hair, dressed in Jedi-like robes in shades of beige and brown, reminiscent of the Star Wars universe. He has a focused and determined expression, looking towards the left of the frame. He is holding a red lightsaber with a glowing blade in his right hand. He wears a wide, dark belt with metallic details. The background suggests an alien planet landscape. Large, reddish-brown rock formations rise dramatically in the foreground. Behind him, a massive, pale blue planet dominates the sky, accompanied by other celestial bodies such as moons and distant stars. The lighting appears to come from multiple sources, including the lightsaber and the celestial bodies, creating a dramatic and otherworldly ambiance, perhaps inspired by science fiction themes popular even in creative circles within.",
  },
  {
    name: "Thanksgiving",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Thanksgiving.jpg",
    description: "Celebrate gratitude with cozy, festive Thanksgiving portraits! Use our AI image generator to create warm seasonal content—perfect for marketing, headshots, or avatars.",
    prompt: "A warm, indoor shot features a fair-skinned young woman with shoulder-length wavy brown hair, preparing a Thanksgiving or festive meal in a cozy kitchen. She is smiling gently at the camera while carving a roasted turkey on a plate surrounded by roasted vegetables, including potatoes and carrots. She is wearing a cream-colored sweater, a light brown apron, and a thick beige scarf wrapped around her neck. The kitchen has a rustic and inviting feel, possibly reflecting the warmth of a home during a festive season. Wooden shelves lined with various kitchenware, pumpkins, and other autumnal decorations adorn the walls. A lit candle, small pumpkins, gourds, and a plate of cranberries or small fruits are arranged on the kitchen counter in the foreground, adding to the festive ambiance. A stove with a kettle is visible in the background to the right. The lighting is soft and warm, emanating from overhead pendant lights, creating a homey and inviting atmosphere typical of holiday gatherings.",
  },
  {
    name: "Vampire Theme",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Vampire+Theme.jpg",
    description: "Sink into darkness with our Vampire Theme AI generator! Create haunting, gothic portraits with AI-powered headshots that embrace the eerie elegance of the undead.",
    prompt: "A dramatic medium shot features a fair-skinned man with dark, slicked-back hair, embodying a vampire persona reminiscent of Dracula. He has a serious and intense gaze, looking directly at the viewer. He is dressed in a formal black suit, a crisp white shirt, and a long, dark overcoat with a striking red inner lining and a tall, stiff red collar that frames his face. One hand is casually placed in his pocket. The setting is a dimly lit, grand interior with tall stone arches and pillars stretching into the hazy background, suggesting an ancient cathedral, castle, or another gothic architectural space, perhaps an imagined dramatic location even within the cultural storytelling. Soft light emanates from an unseen source, creating dramatic shadows and highlighting the man's figure and attire. The overall atmosphere is dark, mysterious, and exudes a sense of classic vampire lore.",
  },
  {
    name: "Vibrant Sketch",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Vibrant+Sketch.jpg",
    description: "Brighten your feed with artistic flair using our Vibrant Sketch AI generator! Design colorful, sketch-style portraits that bring creativity and personality to life.",
    prompt: "A vibrant, stylized digital portrait of a young East Asian woman with long, flowing, wavy black hair. Her skin is smooth and luminous, with a natural glow, and she gazes confidently at the viewer with soft, almond-shaped eyes. She is wearing a sleeveless red garment that drapes elegantly over one shoulder. The image is set against an abstract, colorful background featuring bold splashes and shapes in teal, orange, red, yellow, and white. The composition is pop-art inspired, with a blend of realism and digital illustration techniques. The portrait combines high-contrast lighting and sharp facial details with soft, painterly shading on the body and background. Smooth, clean vector-style lines with airbrush effects and vivid saturation. Symmetrical framing and a modern, energetic mood.",
  },
  {
    name: "Viking Avatar",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Viking+Avatar.jpg",
    description: "Channel Norse strength with our Viking Avatar AI generator! Create bold, powerful portraits using AI-powered headshots that honor the spirit of the North.",
    prompt: "A heroic portrait captures a fair-skinned man with long brown hair pulled back, a rugged beard, and piercing eyes, dressed in detailed medieval armor. The armor is a mix of plate and chainmail, featuring intricate designs on the breastplate and shoulder guards. A dark hooded cloak is draped over his shoulders, adding to his imposing figure, which could be a popular theme in local folklore or historical reenactments around. The background reveals a majestic, mountainous landscape under an overcast sky. A serene lake or fjord stretches out behind him, reflecting the muted light. The distant mountains have snow-capped peaks, suggesting a cold and rugged environment, a stark contrast yet compelling backdrop to the armored figure, perhaps alluding to tales of valor and adventure often narrated in the region. The overall atmosphere is one of strength, solitude, and a touch of fantasy, fitting for a character from local legends or imagined historical figures.",
  },
  {
    name: "Vintage",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Vintage.jpg",
    description: "Travel back in time with our Vintage AI image generator! Create classic, retro-style portraits with AI-powered headshots that capture the charm of bygone eras.",
    prompt: "A softly lit portrait captures a young woman with fair skin and wavy brown hair, looking directly at the camera with a calm and pleasant expression. She is wearing a slightly oversized white button-down shirt, partially unbuttoned at the top, and a delicate gold necklace with a small pendant. The background shows a cozy indoor setting, possibly a well-lit room in a home. Natural sunlight filters in from a window to the left, where a soft pink curtain is partially drawn. The wall behind her is a muted teal color, decorated with abstract circular shapes in warmer tones. A hint of a vase with pink flowers is visible in the lower right corner. The overall atmosphere is relaxed, comfortable, and bathed in gentle, natural light, suggesting a peaceful domestic scene.",
  },
  {
    name: "Witch/Wizard",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Witch+Wizard.png",
    description: "Weave magic into your photos with our Witch & Wizard AI generator! Create mystical, spellbinding portraits using AI-powered headshots straight from a fantasy realm.",
    prompt: "A mystical shot features a woman with tan skin and long, dark wavy hair, dressed as a witch in a pointed black hat and a long, dark flowing gown with wide sleeves. She has a serene yet slightly mysterious expression, looking towards the left. She holds a lit candle in a vintage-style gold candle holder in her right hand. Her dress is cinched at the waist with an ornate gold belt featuring Celtic-like knotwork. A necklace with a pendant adorns her neck. The setting is a misty, atmospheric forest, perhaps drawing inspiration from folklore or imagined mystical locations within. Tall, bare trees fade into the fog in the background. Several lit candles are placed on the ground in the foreground, casting a warm glow against the cool tones of the mist and trees. The overall atmosphere is magical, ethereal, and suggestive of a scene from a fantasy or Halloween-themed narrative, possibly reflecting local interest in such themes.",
  },
  {
    name: "Zombie Apocalypse",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/headshots/Zombie+Apocalypse.jpg",
    description: "Enter survival mode with our Zombie Apocalypse AI generator! Create thrilling, post-apocalyptic portraits with AI-powered headshots that bring the undead world to life.",
    prompt: "A wide shot captures a weathered fair-skinned man with short, dark hair and a determined gaze, standing in the middle of a desolate, ruined urban street, perhaps a scene reflecting themes of resilience sometimes found in narratives within. He is shirtless, revealing a muscular physique and some markings or tattoos on his chest and arms. He wears tattered, light-colored shorts and a long, worn-out green overcoat that is open in the front. He also has a band or piece of cloth tied around his forehead. The street is lined with damaged buildings, showing signs of decay and destruction, possibly from a disaster or conflict. Debris, including broken pieces of concrete, metal scraps, and overturned objects, litters the ground. The atmosphere is bleak and somber, with a muted color palette and a sense of abandonment. The lighting is diffused, suggesting an overcast day or a smoky environment. The overall scene evokes a post-apocalyptic or war-torn setting, hinting at themes of survival and hardship, which may resonate with certain historical or contemporary narratives in the region.",
  },  
];

export const fluxKontextEffects = [
  {
    name: "Default",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/kontext_effect/default.png",
    is_need_input: false,
  },
  {
    name: "Age Progression",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/kontext_effect/age_progression.jpg",
    is_need_input: true,
  },
  {
    name: "Background Change",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/kontext_effect/background_change.jpg",
    is_need_input: true,
  },
  {
    name: "Cartoonify",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/kontext_effect/cartoonify.jpg",
    is_need_input: false,
  },
  {
    name: "Color Correction",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/kontext_effect/color_correction.jpg",
    is_need_input: false,
  },
  {
    name: "Expression Change",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/kontext_effect/expression_change.jpg",
    is_need_input: true,
  },
  {
    name: "Face Enhancement",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/kontext_effect/face_enhancement.jpg",
    is_need_input: false,
  },
  {
    name: "Hair Change",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/kontext_effect/hair_change.jpg",
    is_need_input: true,
  },
  {
    name: "Object Removal",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/kontext_effect/object_removal.jpg",
    is_need_input: true,
  },
  {
    name: "Professional Photo",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/kontext_effect/professional_photo.jpg",
    is_need_input: false,
  },
  {
    name: "Scene Composition",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/kontext_effect/scene_composition.jpg",
    is_need_input: true,
  },
  {
    name: "Style Transfer",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/kontext_effect/style_transfer.jpg",
    is_need_input: true,
  },
  {
    name: "Time of Day",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/kontext_effect/time_of_day.jpg",
    is_need_input: true,
  },
  {
    name: "Weather Effect",
    image_url: "https://d3adwkbyhxyrtq.cloudfront.net/kontext_effect/weather_effect.jpg",
    is_need_input: true,
  },
];

export const aiInfluencerChar = [
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-influencer/Alice.jpeg', name: 'Alice'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-influencer/Ana.jpeg', name: 'Ana'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-influencer/Ben.jpeg', name: 'Ben'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-influencer/Eva.jpeg', name: 'Eva'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-influencer/Josie.jpeg', name: 'Josie'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-influencer/Sam.jpeg', name: 'Sam'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-influencer/Sara.jpeg', name: 'Sara'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-influencer/Tia.jpeg', name: 'Tia'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-influencer/Zoe.jpeg', name: 'Zoe'},
];

export const aiEffects = [
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/ai_animal.webp', name: 'AI Baby Animals' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/ai_hug.webp', name: 'AI Hug' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/catwalk-effect.webp', name: 'AI Baby Catwalk' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/cooking-effect.webp', name: 'AI Cooking Animal' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/dancing-illusion-effect.webp', name: 'AI Dancing Illusion' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/giant-sea-animal-effect.webp', name: 'AI Giant Sea Animal' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/miniature-fantasy-scene.webp', name: 'Miniature Scenes' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/POV-Niche.webp', name: 'POV-Niche' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/pov-history.webp', name: 'POV-History' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/country-animal.webp', name: 'Country Animal' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/country-human-with-beast.webp', name: 'Country Human Beast' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/country-towering.webp', name: 'Country Towering Giant' },
];

export const pikaEffects = [
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Explode.webp', name: 'Explode' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Eye-pop.webp', name: 'Eye-pop' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Melt.webp', name: 'Melt' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Dissolve.webp', name: 'Dissolve' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Levitate.webp', name: 'Levitate' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Poke.webp', name: 'Poke' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Ta-da.webp', name: 'Ta-da' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Crumble.webp', name: 'Crumble' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Peel.webp', name: 'Peel' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Tear.webp', name: 'Tear' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Decapitate.webp', name: 'Decapitate' },
];

export const wanEffects = [
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/super-saiyan.webp', 
    name: 'Super Saiyan Transformation',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/513c0be6-8455-4fa2-bf6c-60b2e8d2d3a8/adapter_model.safetensors",
    trigger_word: "5up3r super saiyan transformation",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/robot-face-reveal.webp', 
    name: 'Robotic Face Reveal',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/5e4b881d-6a1e-4cc7-b827-20b382248d41/adapter_model.safetensors",
    trigger_word: "r8b8t1c robotic face reveal",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/zoom-call.webp', 
    name: 'Zoom Call',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/6a9350e5-f1e6-45cf-a8bc-ea16336ebd31/adapter_model.safetensors",
    trigger_word: "[z00m_ca11]",
    input_type: "t2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/jumpscare.webp', 
    name: 'Jumpscare',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/c8972c6d-ab8a-4988-9a9d-38082264ef22/adapter_model.safetensors",
    trigger_word: "j432mpscare jumpscare",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/selfie-younger-self.webp', 
    name: 'Younger Self Selfie',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/13093298-652c-4df8-ba28-62d9d5924754/adapter_model.safetensors",
    trigger_word: "s31lf13 taking a selfie with their younger self",
    input_type: "i2v", 
  },
  // { 
  //   url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/animeify.webp', 
  //   name: 'animeify',
  //   path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors//adapter_model.safetensors",
  //   trigger_word: "",
  //   input_type: "i2v", 
  // },
  // { 
  //   url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/doom-fps.webp', 
  //   name: 'doom-fps',
  //   path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors//adapter_model.safetensors",
  //   trigger_word: "",
  //   input_type: "i2v", 
  // },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Disney-Princess.webp', 
    name: 'Disney Princess It',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/ae850d09-ec06-46ef-864a-0240c4a9a0f9/adapter_model.safetensors",
    trigger_word: "d15n3y Disney princess transformation",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Princess.webp', 
    name: 'Princess It',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/a769c36b-d8a7-4bdc-9b05-2c37d50dbe08/adapter_model.safetensors",
    trigger_word: "pr1nc355 princess transformation",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Puppy.webp', 
    name: 'Puppy it',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/899ff0c7-07d8-4933-aa4c-7d85bd9d0c3f/adapter_model.safetensors",
    trigger_word: "pu11y puppy effect",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Snow-White.webp', 
    name: 'Snow White It',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/005bf6b9-b2a1-49c6-ba25-0c9924f824ba/adapter_model.safetensors",
    trigger_word: "sn0w_wh1t3 Snow White transformation",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Mona-Lisa.webp', 
    name: 'Mona Lisa It',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/994953a7-acde-4328-9b11-fd1f331ad840/adapter_model.safetensors",
    trigger_word: "m0n4 Mona Lisa transformation",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Samurai.webp', 
    name: 'Samurai It',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/6c7d71e3-b2e8-4afe-83b8-23efe50ead97/adapter_model.safetensors",
    trigger_word: "54mur41 samurai transformation",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Zen.webp', 
    name: 'Zen It',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/328c6078-515a-4fa0-8b5d-9ea993954f80/adapter_model.safetensors",
    trigger_word: "z3n1fy zen transformation",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/tsunami.webp', 
    name: 'Tsunami',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/64e58850-45cb-43e0-864b-3a3bc259afa7/adapter_model.safetensors",
    trigger_word: "t5un@m1 realistic tsunami",
    input_type: "t2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/fire.webp', 
    name: 'Fire',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/c45274ad-bc5d-41f2-acac-64b8cb8c3bf1/adapter_model.safetensors",
    trigger_word: "[r3al_f1re]",
    input_type: "t2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/fus-ro-dah.webp', 
    name: 'Skyrim Fus-Ro-Dah',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/32003b30-7d21-40c2-800c-12fa745acf23/adapter_model.safetensors",
    trigger_word: "fus_r0_d4h force push effect",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Wind+Blast.webp', 
    name: 'Wind Blast',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/3a7ecf14-8fe9-4ad0-97b6-47a5f3dc0208/adapter_model.safetensors",
    trigger_word: "w1ndy_fac3",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Jungle.webp', 
    name: 'Jungle It',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/cf749aeb-5f25-4c6e-b495-3ea8d81004ee/adapter_model.safetensors",
    trigger_word: "1ung13 jungle transformation",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Warrior.webp', 
    name: 'Warrior It',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/4140f3c2-430d-4b47-b40a-997f361d83dc/adapter_model.safetensors",
    trigger_word: "warr10r warrior it",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Assassin.webp', 
    name: 'Assassin It',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/88600b53-336a-4d0c-a1a4-8b53e9775f03/adapter_model.safetensors",
    trigger_word: "3p1c epic transformation",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/crying.webp', 
    name: 'Crying',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/bcc4163d-ebda-4cdc-b153-7136cdbf563a/adapter_model.safetensors",
    trigger_word: "cr471ng crying",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Crush.webp', 
    name: 'Crush It',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/d8a2912b-94e4-4227-9c45-356679af34fd/adapter_model.safetensors",
    trigger_word: "c5us4 crushes it",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Deflate.webp', 
    name: 'Deflate It',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/d806bf17-63a8-40a1-8772-b3257e5588bf/adapter_model.safetensors",
    trigger_word: "d3d1at3 deflate it",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Inflate.webp', 
    name: 'Inflate It',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/da2b1c34-7be8-4161-a733-e8b19a98901c/adapter_model.safetensors",
    trigger_word: "infl4t3 inflates it",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Squish.webp', 
    name: 'Squish It',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/06ce6840-f976-4963-9644-b6cf7f323f90/adapter_model.safetensors",
    trigger_word: "sq41sh squish effect",
    input_type: "i2v", 
  },
  // { 
  //   url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Painting.webp', 
  //   name: 'painting',
  //   path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors//adapter_model.safetensors",
  //   trigger_word: "",
  //   input_type: "i2v", 
  // },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Pirate-Captain.webp', 
    name: 'Pirate Captain',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/26c4248e-4289-4964-b01b-ace89c7ad407/adapter_model.safetensors",
    trigger_word: "p1r4t3 pirate captain transformation",
    input_type: "i2v", 
  },
  // { 
  //   url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Timelapse.webp', 
  //   name: 'timelapse',
  //   path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors//adapter_model.safetensors",
  //   trigger_word: "",
  //   input_type: "i2v", 
  // },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/laughing.webp', 
    name: 'Laughing',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/4ac2fb4e-5ca2-4338-a59c-549167f5b6d0/adapter_model.safetensors",
    trigger_word: "l4a6ing laughing",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Vip.webp', 
    name: 'VIP It',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/fa3355bc-2b7c-42f6-b22e-a6b07937a20c/adapter_model.safetensors",
    trigger_word: "v1p red carpet transformation",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Cakeify.webp', 
    name: 'Cakeify',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/b05c1dc7-a71c-4d24-b512-4877a12dea7e/adapter_model.safetensors",
    trigger_word: "c4k3 cakeify it",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Bride.webp', 
    name: 'Bride It',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/bd3100fe-65be-416c-994f-bb5acee1404d/adapter_model.safetensors",
    trigger_word: "8r1d3 bride effect",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Baby.webp', 
    name: 'Baby It',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/5e45b11e-b9ff-404a-9afa-22a3c5596523/adapter_model.safetensors",
    trigger_word: "848y baby effect",
    input_type: "i2v", 
  },
  // { 
  //   url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Classy.webp', 
  //   name: 'classy',
  //   path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors//adapter_model.safetensors",
  //   trigger_word: "",
  //   input_type: "i2v", 
  // },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/angry-face.webp', 
    name: 'Angry',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/d7cbf9b4-82cd-4a94-ba2f-040e809635fa/adapter_model.safetensors",
    trigger_word: "4ngr23 angry face",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Gun-Shooting.webp', 
    name: 'Gun Reveal',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/d5f7e4bc-361e-41ef-8652-a18d862ff920/adapter_model.safetensors",
    trigger_word: "p5lls g4un pulls a gun and starts shooting.",
    input_type: "i2v", 
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/cartoon-jaw-drop.webp', 
    name: 'Cartoon Jaw Drop',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/e17959c4-9fa5-4e5b-8f69-d1fb01bbe4fa/adapter_model.safetensors",
    trigger_word: "dr0p_j88 comical jaw drop",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Kamehameha.webp',
    name: 'Kamehameha',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/bb6c84fa-995d-4fa0-af40-1623762fb24a/adapter_model.safetensors",
    trigger_word: "K4m3h4m3h4",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Melt+It.webp',
    name: 'Melt It',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/691a97ab-a99d-4090-b314-5f07f7376f26/adapter_model.safetensors",
    trigger_word: "m3lt1ng",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Sharingan+Eyes.webp',
    name: 'Sharingan Eyes',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/c7caaf23-df5a-4945-bedc-033777f1e808/adapter_model.safetensors",
    trigger_word: "Sh4r1ng4nEy3s",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Hulk+Transformation.webp',
    name: 'Hulk Transformation',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/a434002c-d944-4c78-bdc3-f21c1fc8bb48/adapter_model.safetensors",
    trigger_word: "",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Museum+It.webp',
    name: 'Museum It',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/acc3c25d-45a5-4706-bca8-fafeb78c9314/adapter_model.safetensors",
    trigger_word: "p41nt1ng painting frame it",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Muscle+Show+Off.webp',
    name: 'Muscle Show Off',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/3c6fd399-e558-43fa-8cd3-828300aac6f8/adapter_model.safetensors",
    trigger_word: "t2k1s takes off clothes revealing a lean muscular body and shows off muscles",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Hug+Jesus.webp',
    name: 'Hug Jesus',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/615fe106-fec4-44bb-b28b-2864cb322027/adapter_model.safetensors",
    trigger_word: "h54g hugs jesus",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/360+Rotation.webp',
    name: '360 Rotation',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/4ac08cfa-841e-4aa9-9022-c3fc80fb6ef4/adapter_model.safetensors",
    trigger_word: "r0t4tion 360 degrees rotation",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Goblin.webp',
    name: 'Goblin',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/7d1a22ba-a47e-4467-b8f9-dcf970afa89f/adapter_model.safetensors",
    trigger_word: "G0bl1n Goblin",
    input_type: "t2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Orc.webp',
    name: 'Orc',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/97e05099-3133-410f-9af4-521b73645792/adapter_model.safetensors",
    trigger_word: "Orc",
    input_type: "t2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Dogs.webp',
    name: 'Dogs',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/61f17808-e077-46a0-b9dd-db4899666eb8/adapter_model.safetensors",
    trigger_word: "d48g dog video",
    input_type: "t2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Cats.webp',
    name: 'Cats',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/63555064-906e-44e5-bb8e-f53698d85067/adapter_model.safetensors",
    trigger_word: "ca45t cat video",
    input_type: "t2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Looping+Pixel+Art.webp',
    name: 'Looping Pixel Art',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/68b8c8cf-3c25-470e-9fdf-09953d265a3d/adapter_model.safetensors",
    trigger_word: "p1x3lStyl3",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/VHS+Footage.webp',
    name: 'VHS Footage',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/563aa6fe-5d57-40ef-98d4-edb0b9efa4ca/adapter_model.safetensors",
    trigger_word: "vh5_c4m3r4 old VHS style",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Lego.webp',
    name: 'Lego',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/d441b0af-d972-4436-b4b3-f94e449007b3/adapter_model.safetensors",
    trigger_word: "l3g0_5ty13 Lego animation style",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Film+Noir.webp',
    name: 'Film Noir',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/97f7e51a-bf52-4184-a5ed-7e86df5e556e/adapter_model.safetensors",
    trigger_word: "f11m_n01r film noir, black and white video",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Little+Planet.webp',
    name: 'Little Planet',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/bfd19ce0-d909-4d3c-857a-3a050a48c53d/adapter_model.safetensors",
    trigger_word: "Little planet view fisheye lens",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Fantasy+Landscapes.webp',
    name: 'Fantasy Landscapes',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/68a03408-3d8e-4c09-93dd-9483599598ed/adapter_model.safetensors",
    trigger_word: "f4nt4sy_sc3n3 fantasy landscape",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Cyberpunk+2077.webp',
    name: 'Cyberpunk 2077',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/fd17409e-d73b-4418-a838-90aaf3e0eb65/adapter_model.safetensors",
    trigger_word: "C783rpu5k Cyberpunk 2077 style",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Abandoned+Places.webp',
    name: 'Abandoned Places',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/d08b4aa3-99c0-408e-9120-cac8bb0814e0/adapter_model.safetensors",
    trigger_word: "abandoned places",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/POV+Driving.webp',
    name: 'POV Driving',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/d66d5115-17a1-48a3-9f0e-046650023443/adapter_model.safetensors",
    trigger_word: "dr1v12ng POV Driving",
    input_type: "t2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Animal+Documentary.webp',
    name: 'Animal Documentary',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/dddba7fd-8970-4337-8f64-4e6926c8c357/adapter_model.safetensors",
    trigger_word: "4n1m4l animal documentary",
    input_type: "t2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Ultra+Wide.webp',
    name: 'Ultra Wide',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/f1fe7cd3-f43c-454c-823b-18c4160f2ef6/adapter_model.safetensors",
    trigger_word: "u1tr4_w1d3, ultra wide angle shot",
    input_type: "t2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Pixar.webp',
    name: 'Pixar',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/bd29829b-af23-4cfa-8b7e-a92e12597a98/adapter_model.safetensors",
    trigger_word: "p1x4r_5ty13 Pixar animation style",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Live+Wallpaper.webp',
    name: 'Live Wallpaper',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/6da01476-c8af-47f0-8177-b56ae9df5f1a/adapter_model.safetensors",
    trigger_word: "l1v3w4llp4p3r",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Steamboat+Willie.webp',
    name: 'Steamboat Willie',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/b19d99b9-0dad-4cf3-9724-f60f607f7bf2/adapter_model.safetensors",
    trigger_word: "steamboat willie style",
    input_type: "t2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Glamor.webp',
    name: 'Glamor',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/ff8048a2-0b4d-4618-9c1f-19d483c9c905/adapter_model.safetensors",
    trigger_word: "g14m glamorous slow-motion smooth camera effect",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Kiss+Cam.webp',
    name: 'Kiss Cam',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/93974460-740e-4da4-bf5a-ada4e30821c8/adapter_model.safetensors",
    trigger_word: "k155 kiss towards the camera",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Kissing.webp',
    name: 'Kissing',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/687255bb-959e-4422-bdbb-5aba93c7c180/adapter_model.safetensors",
    trigger_word: "k144ing kissing",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Eye+Close-Up.webp',
    name: 'Eye Close-Up',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/48093886-369e-4495-a933-3a43988590f7/adapter_model.safetensors",
    trigger_word: "3y3_cl053 eye extreme close up",
    input_type: "i2v",
  },
  {
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Boxing.webp',
    name: 'Boxing',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/c5baef01-d77f-4f7e-99ff-86371243b35c/adapter_model.safetensors",
    trigger_word: "B0x13ng Boxing Video",
    input_type: "i2v",
  },
];

export const aiModels = [
  {
    id: "Kling Standard",
    name: "Kling Standard v2.1",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/642721667647/0abb43fb-730c-45f6-b98b-a2d96e037f0c.jpg",
    description: "Fast, high-quality for complex scenes.",
    duration: [5, 10],
    aspectRatio: ["16:9", "9:16", "1:1"],
    credits: 40,
    timeTaken: "3-5 minutes",
    inputType: "I2V & T2V"
  },
  {
    id: "Kling Pro",
    name: "Kling Pro v2.1",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/501713710598/25616b56-174e-43a3-84e1-76b9939636c1.jpg",
    description: "Slower but highly detailed output.",
    duration: [5, 10],
    aspectRatio: ["16:9", "9:16", "1:1"],
    credits: 100,
    timeTaken: "5-10 minutes",
    inputType: "I2V & T2V"
  },
  {
    id: "Kling Master",
    name: "Kling Master v2.1",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/558624551279/c104aef8-d463-4a1f-8ee5-c66f72f9e4ae.jpg",
    description: "Generate video clips from your prompts using Kling 2.1 Master",
    duration: [5, 10],
    aspectRatio: ["16:9", "9:16", "1:1"],
    credits: 225,
    timeTaken: "5-10 minutes",
    inputType: "I2V & T2V"
  },
  {
    id: "Kling Elements Std",
    name: "Kling Elements Standard",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/954892113209/bcb6e9e7-13e2-4e09-bc66-425a69f2bc3a.jpg",
    description: "Generate video clips from your multiple image references using Kling 1.6 (standard)",
    duration: [5, 10],
    aspectRatio: ["16:9", "9:16", "1:1"],
    credits: 50,
    timeTaken: "5-10 minutes",
    inputType: "I2V"
  },
  {
    id: "Kling Elements Pro",
    name: "Kling Elements Pro",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/637614690141/41df6ea8-b23f-4eaa-874a-d164b8603600.jpg",
    description: "Generate video clips from your multiple image references using Kling 1.6 (pro)",
    duration: [5, 10],
    aspectRatio: ["16:9", "9:16", "1:1"],
    credits: 120,
    timeTaken: "5-10 minutes",
    inputType: "I2V"
  },
  {
    id: "Hunyuan",
    name: "Hunyuan",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/716418117953/160bca2b-f7ff-48e0-96dc-6af182fd0c16.jpg",
    description: "Higher quality with advanced processing.",
    duration: [5],
    aspectRatio: ["16:9", "9:16", "1:1"],
    credits: 30,
    timeTaken: "5 minutes",
    inputType: "I2V & T2V"
  },
  {
    id: "Fast Hunyuan",
    name: "Fast Hunyuan",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/719086108852/cc3ee378-729c-4f18-8d24-065d60cec93b.jpg",
    description: "Faster, fewer steps, decent quality.",
    duration: [5],
    aspectRatio: ["16:9", "9:16", "1:1"],
    credits: 20,
    timeTaken: "3-5 minutes",
    inputType: "T2V"
  },
  {
    id: "Hunyuan LoRA",
    name: "Hunyuan LoRA",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/497866384420/13ebe2a7-0b9b-48c0-8150-ba8a0ae39880.jpg",
    description: "This is a high visual quality, motion diversity, text-video alignment, and generation stability.",
    duration: [5],
    aspectRatio: ["16:9", "9:16"],
    credits: 80,
    timeTaken: "5 minutes",
    inputType: "T2V"
  },
  {
    id: "Minimax/Hailuo 2 Standard",
    name: "Minimax/Hailuo 2 Standard",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/542819931466/7f726cad-f9b2-4ea2-a785-7f5cd46d1182.jpg",
    description: "Advanced i2v and t2v generation model with 768p resolution",
    duration: [6, 10],
    aspectRatio: ["16:9"],
    credits: 60,
    timeTaken: "3-4 minutes",
    inputType: "I2V & T2V"
  },
  {
    id: "Minimax/Hailuo 2 Pro",
    name: "Minimax/Hailuo 2 Pro",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/281041046165/4017885e-3234-478d-b30e-6755069f92fa.jpg",
    description: "Advanced i2v and t2v generation model with 1080p resolution",
    duration: [6],
    aspectRatio: ["16:9"],
    credits: 120,
    timeTaken: "4-6 minutes",
    inputType: "I2V & T2V"
  },
  {
    id: "Haiper",
    name: "Haiper",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/204056223066/953a446c-6948-42a2-87e4-ce3c66e8e04f.jpg",
    description: "Hyper-realistic videos with Haiper 2.5.",
    duration: [5, 10],
    aspectRatio: ["16:9", "9:16", "1:1"],
    credits: 40,
    timeTaken: "5 minutes",
    inputType: "I2V & T2V"
  },
  {
    id: "Pixverse",
    name: "Pixverse",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/273518967812/f9679221-eaeb-4181-a24c-a5a42ed83708.jpg",
    description: "High-quality text & image to video.",
    duration: [5, 8],
    aspectRatio: ["16:9", "4:3", "1:1", "3:4", "9:16"],
    credits: 80,
    timeTaken: "30 seconds",
    inputType: "I2V & T2V"
  },
  {
    id: "Runwayml gen-4",
    name: "Runwayml gen-4",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/809475541516/a895607c-b724-427c-9020-6c36ebc4af25.jpg",
    description: "Fast, flexible AI video generator.",
    duration: [5, 10],
    aspectRatio: ["16:9", "9:16", "4:3", "3:4", "1:1", "21:9"],
    credits: 40,
    timeTaken: "30 seconds",
    inputType: "I2V"
  },
  {
    id: "SkyReels",
    name: "SkyReels",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/369867585564/7625bf5e-f778-46f4-a568-a5690b812213.jpg",
    description: "SkyReels V1 is first open-source human-centric model.",
    duration: [5],
    //aspectRatio: ["16:9", "9:16", "1:1"],
    aspectRatio: ["16:9", "9:16"],
    credits: 50,
    timeTaken: "5 minutes",
    inputType: "I2V & T2V"
  },
  {
    id: "Veo2",
    name: "Veo2",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/413366991256/822c539f-12eb-4770-aa1e-2539c0ae1a70.jpg",
    description: "Google's most powerful AI Video model.",
    duration: [5,6,7,8],
    aspectRatio: ["16:9", "9:16"],
    credits: 400,
    timeTaken: "5 minutes",
    inputType: "I2V & T2V"
  },
  {
    id: "Veo3",
    name: "Veo3",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/744623273698/2a646bf8-98f5-4045-a128-5d0f3cf4807a.jpg",
    description: "Google's most powerful AI Video model.",
    duration: [8],
    aspectRatio: ["16:9"], //  "9:16", "1:1"
    credits: 600,
    timeTaken: "5 minutes",
    inputType: "I2V & T2V"
  },
  {
    id: "Veo3 Fast",
    name: "Veo3 Fast",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/610483894880/75666419-12c9-4615-8c26-977279c7659a.jpg",
    description: "Google's most powerful AI Video model.",
    duration: [8],
    aspectRatio: ["16:9"], // "9:16", "1:1"
    credits: 120,
    timeTaken: "5 minutes",
    inputType: "T2V"
  },
  {
    id: "Luma txt2vid",
    name: "Luma txt2vid",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/933771773862/2baed35c-fe7a-45fe-bbbb-955d0b919c62.jpg",
    description: "Generate realistic visuals with natural, coherent motion.",
    duration: [5,9],
    aspectRatio: ["16:9", "9:16", "4:3", "3:4", "21:9", "9:21"],
    credits: 40,
    timeTaken: "2 minutes",
    inputType: "T2V"
  },
  {
    id: "Luma img2vid",
    name: "Luma img2vid",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/686410917909/88b51e6e-3363-4943-8d82-ad869707b197.jpg",
    description: "Luma's best model - great for anime, dynamic and realistic video.",
    duration: [5],
    aspectRatio: ["16:9", "9:16", "4:3", "3:4", "21:9", "9:21"],
    credits: 40,
    timeTaken: "2 minutes",
    inputType: "T2V"
  },
  {
    id: "Wan 2.1",
    name: "Wan 2.1",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/498129502777/54f88328-a849-4657-9794-37d04bd460d6.jpg",
    description: "Wan 2.1 generates high visual quality and motion diversity from text prompt and image.",
    duration: [5, 10],
    aspectRatio: ["16:9", "9:16"],
    quality: ['480p', '720p'],
    speed: ['medium', 'high'],
    credits: 60,
    timeTaken: "3 minutes",
    inputType: "I2V & T2V"
  },
  {
    id: "Wan 2.1 LoRA",
    name: "Wan 2.1 LoRA",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/610200073322/55168863-676f-4e42-a98b-3366ec4cdd5f.jpg",
    description: "Generates high-quality videos with high visual quality and motion diversity from images.",
    duration: [5, 10],
    aspectRatio: ["16:9", "9:16"],
    quality: ['480p', '720p'],
    speed: ['medium', 'high'],
    credits: 60,
    timeTaken: "3 minutes",
    inputType: "I2V & T2V"
  },
  {
    id: "Seedance Lite",
    name: "Seedance Lite",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/572293817553/dfd33c43-a205-4c87-9c79-b8821e755dd4.jpg",
    description: "ByteDance’s Seedance 1.0 is the new SOTA video generation model",
    duration: [5, 10],
    aspectRatio: ["16:9", "9:16", "1:1", "21:9", "9:21", "4:3", "3:4"],
    quality: ['480p', '720p', '1080p'],
    credits: 30,
    timeTaken: "3 minutes",
    inputType: "I2V & T2V"
  },
  {
    id: "Seedance Pro",
    name: "Seedance Pro",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/899028769013/585ac3f5-a6bf-4b78-88c3-6dd3aaf89389.jpg",
    description: "ByteDance’s Seedance 1.0 is the new SOTA video generation model",
    duration: [5, 10],
    aspectRatio: ["16:9", "9:16", "1:1", "21:9", "9:21", "4:3", "3:4"],
    quality: ['480p', '720p', '1080p'],
    credits: 50,
    timeTaken: "3 minutes",
    inputType: "I2V & T2V"
  },
  {
    id: "Pika v2",
    name: "Pika v2",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/279819850271/2104e9a5-e4a3-442c-a1f2-705fbd065675.jpg",
    description: "Pika v2 Turbo creates videos from images with high quality output.",
    duration: [5],
    aspectRatio: ["16:9", "9:16", "1:1", "5:4", "4:5"],
    credits: 40,
    timeTaken: "3 minutes",
    inputType: "I2V & T2V"
  },
  {
    id: "Vidu",
    name: "Vidu",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/503462032266/1fcbda08-5f0b-48da-9125-8969e5716705.jpg",
    description: "Vidu Image to Video creates high-quality, dynamic videos from a single image.",
    duration: [5],
    aspectRatio: ["16:9", "9:16"],
    credits: 40,
    timeTaken: "3 minutes",
    inputType: "I2V & T2V"
  },
  {
    id: "LTXVideo",
    name: "LTXVideo",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/513437689942/dd537319-08a8-4c11-94e5-e45499168349.jpg",
    description: "Slow, lower quality, basic videos.",
    duration: [5],
    aspectRatio: ["16:9", "9:16"],
    credits: 30,
    timeTaken: "5-8 minutes",
    inputType: "I2V & T2V"
  },
  {
    id: "LTX LoRA",
    name: "LTX LoRA",
    image: "https://d3adwkbyhxyrtq.cloudfront.net/ai-images/186/158063768835/5cca0deb-a95f-4630-8e7a-eb1587b8b16d.jpg",
    description: "Generate videos from prompts and images using LTX Video-0.9.7 13B Distilled",
    duration: [5],
    aspectRatio: ["16:9", "9:16", "1:1"],
    credits: 50,
    timeTaken: "2-3 minutes",
    inputType: "I2V & T2V"
  },
];

export const pixverseEffects = [
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/none.png', name: null },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Kiss_Me_AI.webp', name: 'Kiss Me AI' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Kiss.webp', name: 'Kiss' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Venom.webp', name: 'Venom' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Hulk_.webp', name: 'Hulk' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Muscle_Surge.webp', name: 'Muscle Surge' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/The_Tiger_Touch.webp', name: 'The Tiger Touch' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Anything_Robot.webp', name: 'Anything, Robot' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Warmth_of_Jesus.webp', name: 'Warmth of Jesus' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Holy_Wings.webp', name: 'Holy Wings' },
  { effect: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/Microwave.webp', name: 'Microwave' },
];

export const filterImages = [
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/anime.webp', name: 'Anime'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/cartoon.webp', name: 'Cartoon'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/pixar.webp', name: 'Pixar'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/3d.webp', name: '3D'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/pop+art.webp', name: 'Pop Art'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/comic+book.webp', name: 'Comic Book'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/studio+ghibli.webp', name: 'Studio Ghibli'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/clay.webp', name: 'Clay'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/disney.webp', name: 'Disney'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/webtoon.webp', name: 'Webtoon'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/art.webp', name: 'Art'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/digital+art.webp', name: 'Digital Art'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/pixel+art.webp', name: 'Pixel Art'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/renaissance+painting.webp', name: 'Renaissance'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/oil+painting.webp', name: 'Oil Painting'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/impressionist+painting.webp', name: 'Impressionist'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/watercolor.webp', name: 'Watercolor'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/sketch.webp', name: 'Sketch'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/line+drawing.webp', name: 'Line Drawing'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/caricature.webp', name: 'Caricature'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/painting.webp', name: 'Painting'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/vector+art.webp', name: 'Vector Art'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/monet.webp', name: 'Monet'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/van+gogh.webp', name: 'Van Gogh'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/illustration.webp', name: 'Illustration'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/zelda.webp', name: 'Zelda'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/ps2.webp', name: 'PS2'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/minecraft.webp', name: 'Minecraft'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/manga.webp', name: 'Manga'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/gta.webp', name: 'GTA'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/goth.webp', name: 'Goth'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/sims.webp', name: 'Sims'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/fallout.webp', name: 'Fallout'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/mha.webp', name: 'MHA'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/mortal+kombat.webp', name: 'Mortal Kombat'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/one+piece.webp', name: 'One Piece'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/christmas.webp', name: 'Christmas'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/thanksgiving.webp', name: 'Thanksgiving'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/new+year.webp', name: 'New Year'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/halloween.webp', name: 'Halloween'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/superhero.webp', name: 'Superhero'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/avatar.webp', name: 'Avatar'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/emoji.webp', name: 'Emoji'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/royal+portrait.webp', name: 'Royal Portrait'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/vintage.webp', name: 'Vintage'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/simpsons.webp', name: 'Simpsons'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/bridgerton.webp', name: 'Bridgerton'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/barbie.webp', name: 'Barbie'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/wednesday+addams.webp', name: 'Wednesday Addams'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/tim+burton.webp', name: 'Tim Burton'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/vampire.webp', name: 'Vampire'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/witch.webp', name: 'Witch'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/zombie.webp', name: 'Zombie'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/lego.webp', name: 'Lego'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/wonder+woman.webp', name: 'Wonder Woman'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/jojo.webp', name: 'Jojo'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/grinch.webp', name: 'Grinch'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/ghost.webp', name: 'Ghost'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/the+last+of+us.webp', name: 'The Last Of Us'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/demon+slayer.webp', name: 'Demon Slayer'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/viking.webp', name: 'Viking'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/spider+man.webp', name: 'Spiderman'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/baby.webp', name: 'Baby'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/aging.webp', name: 'Aging'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/fat.webp', name: 'Fat Filter'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/skinny.webp', name: 'Skinny'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/1930s.webp', name: '1930'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/1970s.webp', name: '1970'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/1980s.webp', name: '1980'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/yearbook.webp', name: 'Yearbook'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/boondocks.webp', name: 'Boondocks'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/fitness.webp', name: 'Fitness'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/lookism.webp', name: 'Lookism'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/korean.webp', name: 'Korean'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/japanese.webp', name: 'Japanese'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/chinese.webp', name: 'Chinese'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/playboy+bunny.webp', name: 'Playboy Bunny'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/vampire+queen.webp', name: 'Vampire Queen'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/zombie+bride.webp', name: 'Zombie Queen'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/zombie+groom.webp', name: 'Zombie Groom'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/skeleton+queen.webp', name: 'Skeleton Queen'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/skeleton+king.webp', name: 'Skeleton King'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/creepy+doll.webp', name: 'Creepy Doll'},
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/filters/cyborg.webp', name: 'Cyborg'},
];

export const motionControls = [
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/360+Orbit.webp', 
    name: '360 Orbit',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/aaa3e820-5d94-4612-9488-0c9a1b2f5843/adapter_model.safetensors",
    trigger_word: "0rb4it 360 degree orbit",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Action+Run.webp', 
    name: 'Hero Run',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/36b9edf7-31d7-47d3-ad3b-e166fb3a9842/adapter_model.safetensors",
    trigger_word: "4ct3ion Action Run",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Arc.webp', 
    name: 'Arc Shot',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/a5949ee3-61ea-4a18-bd4d-54c855f5401c/adapter_model.safetensors",
    trigger_word: "34Ar2c arc the camera moves in a smooth curve around",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Bullet+Time.webp', 
    name: 'Matrix Shot',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/219ad5ad-8f23-48dc-b098-b8e6d9fbe6c0/adapter_model.safetensors",
    trigger_word: "b4ll3t t1m3 bullet time shot",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Car+Chasing.webp', 
    name: 'Car Chase',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/8b36b7fe-0a0b-4849-b0ed-d9a51ff0cc85/adapter_model.safetensors",
    trigger_word: "c4r ch4s3 car chase",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Crane+Down.webp', 
    name: 'Crane Down',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/f26db0b7-1c26-4587-b2b5-1cfd0c51c5b3/adapter_model.safetensors",
    trigger_word: "cr4n3 crane down camera motion",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Crane+Over+The+Head.webp', 
    name: 'Crane Overhead',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/9393f8f4-abe6-4aa7-ba01-0b62e1507feb/adapter_model.safetensors",
    trigger_word: "cr4n3 crane over the head movement",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Crane+Up.webp', 
    name: 'Crane Up',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/07c5e22b-7028-437c-9479-6eb9a50cf993/adapter_model.safetensors",
    trigger_word: "cr4n3 crane up effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Crash+Zoom+In.webp', 
    name: 'Crash Zoom In',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/34a80641-4702-4c1c-91bf-c436a59c79cb/adapter_model.safetensors",
    trigger_word: "cr34sh crash zoom in effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Crash+Zoom+Out.webp', 
    name: 'Crash Zoom Out',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/44c05ca1-422d-4cd4-8508-acadb6d0248c/adapter_model.safetensors",
    trigger_word: "cr34sh crash zoom out effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Dirty+Lens.webp', 
    name: 'Dirty Lens',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/47296f63-6725-4e8c-8e1b-1a57d7b6f270/adapter_model.safetensors",
    trigger_word: "d23rty dirty lens effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Dolly+In.webp', 
    name: 'Dolly In',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/5d6aa0e9-24f0-43f8-acd0-03e10e06a8db/adapter_model.safetensors",
    trigger_word: "d00ll1y dolly in effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Dolly+Left.webp', 
    name: 'Dolly Left',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/65374dad-2c16-4a0e-b09d-7c18311f72f9/adapter_model.safetensors",
    trigger_word: "d00ll1y dolly left effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Dolly+Out.webp', 
    name: 'Dolly Out',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/ec914ae1-0da7-48d3-b6ae-5ff08b7c0e56/adapter_model.safetensors",
    trigger_word: "d00ll1y dolly out effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Dolly+Right.webp', 
    name: 'Dolly Right',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/f9453d4f-3282-40bb-80be-f7e97f48b2e4/adapter_model.safetensors",
    trigger_word: "d00ll1y dolly right effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Dolly+Zoom+In.webp', 
    name: 'Dolly Zoom In',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/493e2c20-655e-4db4-8a78-1ae45c973fa3/adapter_model.safetensors",
    trigger_word: "d00ll1y dolly zoom in effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Dolly+Zoom+Out.webp', 
    name: 'Dolly Zoom Out',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/d25e9b90-e935-4e48-88f4-97001763994c/adapter_model.safetensors",
    trigger_word: "d00ll1y dolly zoom out effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Dutch+Angle.webp', 
    name: 'Dutch Angle',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/65b7ff6a-31f2-4735-b93f-c09815f89780/adapter_model.safetensors",
    trigger_word: "du1c8 dutch angle camera tilt",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Fisheye.webp', 
    name: 'Fisheye Lens',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/8a638ef0-be0b-43b2-9965-a253ae198413/adapter_model.safetensors",
    trigger_word: "f15h3y3 wide rounded fisheye lens effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Focus+Change.webp', 
    name: 'Focus Shift',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/5fbee8c1-2063-49ca-a658-ceee75f25571/adapter_model.safetensors",
    trigger_word: "f0cu5 camera focus shift",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/FPV+Drone.webp', 
    name: 'FPV Drone Cam',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/de0b0348-be4e-47b7-ade7-6e1d2b27c695/adapter_model.safetensors",
    trigger_word: "f1r5t first person view fast drone shot",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Handheld.webp', 
    name: 'Handheld Cam',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/cefb7691-be75-4e98-a2a4-b7a34b5d4c78/adapter_model.safetensors",
    trigger_word: "h4ndh31d shaky handheld camera effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Head+Tracking.webp', 
    name: 'Head Tracking',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/8693ca5e-accd-4c75-82e3-e0be2194fe80/adapter_model.safetensors",
    trigger_word: "h34d head tracking shot",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Lazy+Susan.webp', 
    name: 'Lazy Susan',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/64c6c491-6c06-444e-9e7e-e254ed447df2/adapter_model.safetensors",
    trigger_word: "sm00th_r0t4t3 smooth camera rotation",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Mouth+In.webp', 
    name: 'Zoom Into Mouth',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/5609868a-b0a0-45da-b8a2-1bdc64ae4762/adapter_model.safetensors",
    trigger_word: "z00m_m0uth zoom into mouth effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Object+POV.webp', 
    name: 'Object POV',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/51696ad2-88e4-4cd1-ab0e-c5bd67a0f44b/adapter_model.safetensors",
    trigger_word: "0bj3ct object POV camera shot",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Overhead.webp', 
    name: 'Overhead',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/c86b6e2f-6960-4cfe-bd0a-f28e97617d1a/adapter_model.safetensors",
    trigger_word: "0v3rh34d overhead camera shot",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Rap+Flex.webp', 
    name: 'Rap Video Cam',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/d3822930-06b3-4480-abb1-10c00df71622/adapter_model.safetensors",
    trigger_word: "r4p rap music video camera effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Robo+Arm.webp', 
    name: 'Robotic Cam',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/026df5f8-c8b8-486f-87f5-b890dd66ee1d/adapter_model.safetensors",
    trigger_word: "r0b0t1c high speed robotic camera",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Snorricam.webp', 
    name: 'Snorricam',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/47d9bc77-8f3d-4e82-9f0e-a5fdaf4fa7e8/adapter_model.safetensors",
    trigger_word: "5norr1c4m snorricam camera shot",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Super+Dolly+In.webp', 
    name: 'Fast Dolly Zoom In',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/aa5e5774-0c7e-4d36-9cfd-0dd5ded89633/adapter_model.safetensors",
    trigger_word: "z00m fast camera dolly zoom in",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Super+Dolly+Out.webp', 
    name: 'Fast Dolly Zoom Out',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/ae0b1f56-b2f7-4318-86f3-c5334ca3a921/adapter_model.safetensors",
    trigger_word: "z00m fast camera dolly zoom out",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Through+Object+In.webp', 
    name: 'Zoom In Through Object',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/bcea1c51-24e4-4115-8048-a07c7ce651b8/adapter_model.safetensors",
    trigger_word: "z00m_1n camera zoom in through object",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Through+Object+Out.webp', 
    name: 'Zoom Out Through Object',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/a2e0da73-4e97-49d2-a9c0-52408a337a9a/adapter_model.safetensors",
    trigger_word: "z00m 0ut camera zoom out through object",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Tilt+Down.webp', 
    name: 'Tilt Down',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/5ed8b7a8-2c9b-41ac-868e-a4a257969272/adapter_model.safetensors",
    trigger_word: "t1lt camera tilt down effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Timelapse+Human.webp', 
    name: 'Human Timelapse',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/18ede500-84f1-462e-968a-1539d1041bff/adapter_model.safetensors",
    trigger_word: "hum4n human timelapse",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Timelapse+Landscape.webp', 
    name: 'Landscape Timelapse',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/a19264ae-f9ce-4891-9584-18dc0cde9b82/adapter_model.safetensors",
    trigger_word: "l4nd5c4pe landscape timelapse",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Whip+Pan.webp', 
    name: 'Whip Pan',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/ad7b7ae6-fc92-4360-a2d1-485dbb4b27bc/adapter_model.safetensors",
    trigger_word: "wh1p_p4n whip pan camera movement occurs",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Wiggle.webp', 
    name: 'Wiggle',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/6b1a5b3b-8b50-4749-a434-41bee948726b/adapter_model.safetensors",
    trigger_word: "w1gg13 camera wiggle effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Lens+Flare.webp', 
    name: 'Lens Flare',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/7ba721e8-2ff5-4303-aab5-d6f1897708e8/adapter_model.safetensors",
    trigger_word: "l3ns lens flare effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Lens+Crack.webp', 
    name: 'Lens Crack',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/e75ea7ef-7879-4d92-834a-0f8248c78f31/adapter_model.safetensors",
    trigger_word: "l3n5 lens crack camera effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Crane+Punch-In.webp', 
    name: 'Crane Punch-In',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/b35a3b38-fa9d-44ab-aca2-3817a899475b/adapter_model.safetensors",
    trigger_word: "cr4n3 crane over the head and crash zoom in effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Motion+Blur.webp', 
    name: 'Motion Blur',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/e4ed2c19-45c5-4a1b-af9a-911be826d9aa/adapter_model.safetensors",
    trigger_word: "l0w_shut13r motion blur camera effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Car+Mount+Cam.webp', 
    name: 'Car Mount Cam',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/aa8c5c08-6fad-4efc-b41a-f1a20470ad8c/adapter_model.safetensors",
    trigger_word: "c4r m89nted the camera is mounted on the car",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Tilt+Up.webp', 
    name: 'Tilt Up',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/aa2dfb4c-01fa-4a8c-8e3c-9f33f0f9c354/adapter_model.safetensors",
    trigger_word: "t1lt camera tilt up effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Zoom+In.webp', 
    name: 'Zoom In',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/bacb45a7-b7ee-4687-817c-7ef8565944c8/adapter_model.safetensors",
    trigger_word: "z00m camera zoom in",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Zoom+Out.webp', 
    name: 'Zoom Out',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/2b2e65c1-3ddf-4c93-b678-118910cd7e41/adapter_model.safetensors",
    trigger_word: "z00m camera zoom out effect",
    input_type: "i2v",
  },
];

export const vfxControls = [
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Levitation.webp', 
    name: 'Levitate',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/29068e70-dc05-4cfa-9b68-305d45645b00/adapter_model.safetensors",
    trigger_word: "lev1tate2_it0 levitate effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Disintegration.webp', 
    name: 'Disintegration',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/971ea00a-f708-44ce-83cf-e54006ea1f76/adapter_model.safetensors",
    trigger_word: "d1s1nt34gration disintegration effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Flying.webp', 
    name: 'Flying',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/5dc604ed-1e2f-44d5-9437-7f56aa6205ac/adapter_model.safetensors",
    trigger_word: "f1y1ng smooth gliding flight",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Car+Explosion.webp', 
    name: 'Car Explosion',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/efea3aa4-32e8-4523-af44-7e59d731d453/adapter_model.safetensors",
    trigger_word: "c3r exp356l0sion the car explodes bursting into flames and debris",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Tornado.webp', 
    name: 'Tornado',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/1907141a-c058-47d4-837e-078983a6f710/adapter_model.safetensors",
    trigger_word: "t0r54d0 realistic tornado",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Electricity.webp', 
    name: 'Electricity',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/9aad6061-a858-43df-8202-b44f036e04c2/adapter_model.safetensors",
    trigger_word: "e13c7r1c electricity effect",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Huge+Explosion.webp', 
    name: 'Huge Explosion',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/dcdb7020-02b4-42cb-b623-16902db65e90/adapter_model.safetensors",
    trigger_word: "3xp105ion huge explosion",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Decay+Time-Lapse.webp', 
    name: 'Decay Time-Lapse',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/6b6f64dc-ac14-44b2-b91c-a510cb7f7f32/adapter_model.safetensors",
    trigger_word: "d3c4y decay time-lapse begins",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Tsunami.webp', 
    name: 'Tsunami',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/64e58850-45cb-43e0-864b-3a3bc259afa7/adapter_model.safetensors",
    trigger_word: "t5un@m1 realistic tsunami",
    input_type: "t2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Fire.webp', 
    name: 'Fire',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/c45274ad-bc5d-41f2-acac-64b8cb8c3bf1/adapter_model.safetensors",
    trigger_word: "[r3al_f1re]",
    input_type: "t2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Robotic+Face+Reveal.webp', 
    name: 'Robotic Face Reveal',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/5e4b881d-6a1e-4cc7-b827-20b382248d41/adapter_model.safetensors",
    trigger_word: "r8b8t1c robotic face reveal",
    input_type: "i2v",
  },
  { 
    url: 'https://d3adwkbyhxyrtq.cloudfront.net/motioncontrols/Building+Explosion.webp', 
    name: 'Building Explosion',
    path: "https://d3adwkbyhxyrtq.cloudfront.net/loratensors/77a2daa2-c255-4ea8-9581-594853a6d96e/adapter_model.safetensors",
    trigger_word: "b32ldi4ng exp39lsion the building explodes in a massive blast",
    input_type: "i2v",
  },
];

export const veo3Effects = [
  {
    url: "https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/ai_video_asmr.jpeg",
    name: "asmr"
  },
  {
    url: "https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/ai_video_big_foot.jpg",
    name: "bigfoot vlog"
  },
  {
    url: "https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/ai_video_stormtrooper.jpg",
    name: "stormtrooper vlog"
  },
  {
    url: "https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/ai_video_karen.jpeg",
    name: "karen vlog"
  },
  {
    url: "https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/ai_video_bible.jpeg",
    name: "bible vlog"
  },
  {
    url: "https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/ai_video_alien_interview.jpeg",
    name: "alien interview"
  },
  {
    url: "https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/street_interviewer.webp",
    name: "street interview"
  },
  {
    url: "https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/ai_video_history_interview.jpg",
    name: "history interview"
  },
  {
    url: "https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/pov_history.png",
    name: "history pov"
  },
  {
    url: "https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/dog_olympic_diving.jpg",
    name: "animal olympics"
  },
  {
    url: "https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai_effects/reaction.webp",
    name: "reaction"
  },
];

export const aprilPrankImages = [
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Animal+Head.png', name: 'Animal Head', prompt: 'The person’s head is replaced with an animal head (duck, cat, dog, etc.)' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Big+Ears.png', name: 'Big Ears', prompt: 'The person is given big ears, like Dumbo' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Big+Nose.png', name: 'Big Nose', prompt: 'The person’s nose is exaggeratedly large, like a cartoon' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Black+Hole+Face.png', name: 'Black Hole Face', prompt: 'The person’s face is being pulled into a black hole-like vortex' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Bobblehead.png', name: 'Bobblehead', prompt: 'The person is turned into a bobblehead with an oversized wobbly head' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Clown+Nose.png', name: 'Clown Nose', prompt: 'The person’s nose is replaced by a honking clown nose.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Clown+Outfit.png', name: 'Clown Outfit', prompt: 'The person is wearing a clown outfit' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Crazy+Hair.png', name: 'Crazy Hair', prompt: 'The person’s hair is styled into a gravity-defying, cartoonish shape (like a question mark).' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Creepy+Photobomb.png', name: 'Creepy Photobomb', prompt: 'The person is photobombed by a creepy or hilarious background character' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Crossed+Eyes.png', name: 'Crossed Eyes', prompt: 'The person’s eyes are looking in two different directions due to a glitch' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Deal+With+It.png', name: 'Deal With It', prompt: 'The person is wearing sunglasses with “Deal With It” text floating above' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Dirty+Teeth.png', name: 'Dirty Teeth', prompt: 'The person’s teeth are yellowed and unbrushed' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Energy+Drink.png', name: 'Energy Drink', prompt: 'The person is holding an energy drink' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Extra+Head.png', name: 'Extra Head', prompt: 'The person has an extra head growing out of their shoulder' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Fake+News.png', name: 'Fake News', prompt: 'The person is holding a microphone as if reporting nonsense news.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Frizzy+Hair.png', name: 'Frizzy Hair', prompt: 'The person is given a frizzy perm haircut' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Fruit+Head.png', name: 'Fruit Head', prompt: 'The person’s head is replaced with a giant fruit (watermelon, pineapple, etc.).' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Giant+Baby.png', name: 'Giant Baby', prompt: 'The person is wearing a giant baby costume with a pacifier.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Glitch+Face.png', name: 'Glitch Face', prompt: 'The person’s face is duplicated infinitely smaller and smaller like a glitch' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Green+Skin.png', name: 'Green Skin', prompt: 'The person’s skin is bright green, like an alien' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Invisible+Food.png', name: 'Invisible Food', prompt: 'The person is holding an invisible sandwich and pretending to eat it' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Jell-O+Body.png', name: 'Jell-O Body', prompt: 'The person’s entire body is made of Jell-O and wobbling' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Meme+Face.png', name: 'Meme Face', prompt: 'The person’s face is replaced with a meme face like “Trollface” or “Shrek”' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Messy+Hair.png', name: 'Messy Hair', prompt: 'The person has messy, unwashed hair sticking out in all directions' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Mirror+Glitch.png', name: 'Mirror Glitch', prompt: 'The person’s reflection in the mirror is doing something different than they are' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Mixed-Up+Face.png', name: 'Mixed-Up Face', prompt: 'The person’s facial features are swapped around (eyes where mouth should be, etc.)' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Noodle+Hair.png', name: 'Noodle Hair', prompt: 'The person’s hair is replaced with spaghetti or noodles' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Old+Cyborg.png', name: 'Old Cyborg', prompt: 'The person is made to look like a wrinkly old cyborg' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Oversized+Bowtie.png', name: 'Oversized Bowtie', prompt: 'The person is wearing a ridiculous oversized bowtie' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Shocked+Face.png', name: 'Shocked Face', prompt: 'The person’s facial expression is exaggeratedly shocked or confused' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Sleep+Deprived.png', name: 'Sleep Deprived', prompt: 'The person has huge dark circles under their eyes (as if they haven’t slept in years)' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Space+Suit.png', name: 'Space Suit', prompt: 'The person is dressed in a metallic space jumpsuit' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Steam+Ears.png', name: 'Steam Ears', prompt: 'The person has cartoonish steam coming out of their ears as if they are angry' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Superhero+Cape.png', name: 'Superhero Cape', prompt: 'The person has an exaggerated superhero cape flowing dramatically behind them' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Thick+Glasses.png', name: 'Thick Glasses', prompt: 'The person has oversized, thick-lensed glasses' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Third+Eye.png', name: 'Third Eye', prompt: 'The person has a third eye in the middle of their forehead' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Tiny+Mustache.png', name: 'Tiny Mustache', prompt: 'The person has a tiny cartoon mustache drawn on their face' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Trapped+in+TV.png', name: 'Trapped in Tv', prompt: 'The person is trapped inside a TV screen with static effects' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/prankeffects/Ugly+Sweater.png', name: 'Ugly Sweater', prompt: 'The person is wearing a neon or ugly sweater' },
];

export const hairStyles = [
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/hairstyles/Balayage.png', name: 'Balayage', prompt: 'Add natural balayage highlights for a sun-kissed effect.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/hairstyles/Blunt+Bangs.png', name: 'Blunt Bangs', prompt: 'Apply straight, thick blunt bangs for a bold appearance.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/hairstyles/Bob+Cut.png', name: 'Bob Cut', prompt: 'Apply a sleek, chin-length bob cut with a smooth finish.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/hairstyles/Braided+Styles.png', name: 'Braided Styles', prompt: 'Add intricate braids such as box braids or Dutch braids for a stylish effect.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/hairstyles/Butterfly+Cut.png', name: 'Butterfly Cut', prompt: 'Create a butterfly cut with long, flowing layers resembling wings.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/hairstyles/Buzz+Cut.png', name: 'Buzz Cut', prompt: 'Transform the hair into a bold, short buzz cut.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/hairstyles/Curtain+Bangs.png', name: 'Curtain Bangs', prompt: 'Add soft, face-framing curtain bangs for a stylish touch.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/hairstyles/Fantasy+Colors.png', name: 'Fantasy Colors', prompt: 'Apply a vibrant fantasy hair color like pastel pink or electric blue.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/hairstyles/Faux+Hawk.png', name: 'Faux Hawk', prompt: 'Style the hair into a faux hawk for a bold, edgy appearance.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/hairstyles/French+Bob.png', name: 'French Bob', prompt: 'Create a chic French bob with a slight curl at the ends.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/hairstyles/Layered+Lob.png', name: 'Layered Lob', prompt: 'Apply a layered lob cut for a stylish medium-length look.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/hairstyles/Long+Layers.png', name: 'Long Layers', prompt: 'Add long, flowing layers for a voluminous and soft look.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/hairstyles/Mullet.png', name: 'Mullet', prompt: 'Style the hair into a mullet with short front layers and a longer back.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/hairstyles/Ombre.png', name: 'Ombre', prompt: 'Create an ombre hairstyle with dark roots fading into lighter ends.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/hairstyles/Pixie+Cut.png', name: 'Pixie Cut', prompt: 'Transform the hairstyle into a short, edgy pixie cut.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/hairstyles/Shag+Cut.png', name: 'Shag Cut', prompt: 'Apply a shaggy, textured haircut for a relaxed and trendy look.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/hairstyles/Space+Buns.png', name: 'Space Buns', prompt: 'Create cute space buns on both sides of the head for a fun, trendy look.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/hairstyles/Two-Tone+Hair.png', name: 'Two-Tone+Hair', prompt: 'Give the hair a trendy two-tone effect with contrasting colors.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/hairstyles/Undercut.png', name: 'Undercut', prompt: 'Shave the sides for an undercut with longer hair on top.' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/hairstyles/Wolf+Cut.png', name: 'Wolf Cut', prompt: 'Style the hair into a layered wolf cut with a mix of retro and modern vibes.' },
];

export const aiEffectAnimals = [
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/static/baby_animals/baby_elephant.png', name: 'Baby Elephant', animal: 'Elephant' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/static/baby_animals/baby_giraffee.png', name: 'Baby Giraffe', animal: 'Giraffe' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/static/baby_animals/baby_bunny.png', name: 'Baby Bunny', animal: 'Rabbit' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/static/baby_animals/baby_cat(kitten).png', name: 'Baby Cat(kitten)', animal: 'Cat' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/static/baby_animals/baby_cheetah.png', name: 'Baby Cheetah', animal: 'Cheetah' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/static/baby_animals/baby_dog(puppy).png', name: 'Baby Dog(puppy)', animal: 'Dog' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/static/baby_animals/baby_fox.png', name: 'Baby Fox', animal: 'Fox' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/static/baby_animals/baby_hedgehog.png', name: 'Baby Hedgehog', animal: 'Hedgehog' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/static/baby_animals/baby_hen(chick).png', name: 'Baby Hen(Chick)', animal: 'Hen' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/static/baby_animals/baby_koala.png', name: 'Baby Koala', animal: 'Koala' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/static/baby_animals/baby_lion(cub).png', name: 'Baby Lion', animal: 'Lion' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/static/baby_animals/baby_otter.png', name: 'Baby Otter', animal: 'Otter' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/static/baby_animals/baby_panda.png', name: 'Baby Panda', animal: 'Panda' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/static/baby_animals/baby_penguin.png', name: 'Baby Penguin', animal: 'Penguin' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/static/baby_animals/baby_sloth.png', name: 'Baby Sloth', animal: 'Sloth' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/static/baby_animals/baby_snake.png', name: 'Baby Snake', animal: 'Snake' },
  { image: 'https://d3adwkbyhxyrtq.cloudfront.net/static/baby_animals/baby_tiger.png', name: 'Baby Tiger', animal: 'Tiger' },
];

export const aiImageStyles = [
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/none.png', name: null },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/3d.webp', name: '3D Render' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/cartoon.webp', name: 'Cartoon' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/comic.webp', name: 'Comic' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/dark-light-dreamscape.webp', name: 'Dark Light' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/dark-sci-fi.webp', name: 'Dark Sci-Fi' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/fantasy.webp', name: 'Fantasy' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/illustration.webp', name: 'Illustration' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/low-key-cinematic.webp', name: 'Cinematic' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/nature.webp', name: 'Nature' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/oil-painting.webp', name: 'Oil Painting' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/pixel.webp', name: 'Pixel Art' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/product.webp', name: 'Product' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/retro-wave.webp', name: 'Retro' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/sketch.webp', name: 'Sketch' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/vintage-japansese.webp', name: 'Japanese' },
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-styles/water-colour.webp', name: 'Watercolor' },
];

export const aiImageLighting = [
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/none.png', name: null, description: null},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-lighting/dramatic.webp', name: 'Dramatic', description: 'High-contrast spot light direction'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-lighting/high-flash.webp', name: 'High Flash', description: 'Instant sharp bold lighting'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-lighting/iridescent.webp', name: 'Iridescent', description: 'Soft rainbow magical highlights'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-lighting/long-exposure.webp', name: 'Long Exposure', description: 'Dreamy motion-blurred light trails'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-lighting/natural.webp', name: 'Natural', description: 'Warm sunlight with glow'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-lighting/neon.webp', name: 'Neon', description: 'Vibrant electric urban colors'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-lighting/silhouette.webp', name: 'Silhouette', description: 'Backlit figure against glow'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-lighting/studio-lighting.webp', name: 'Studio', description: 'Crisp controlled portrait lighting'},
];

export const aiImageCamera = [
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/none.png', name: null, description: null},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-camera/aerial.webp', name: 'Aerial View', description: 'Overhead landscape perspective'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-camera/close-up.webp', name: 'Close-up', description: 'Sharp details, blurred background'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-camera/ground-view.webp', name: 'Ground View', description: 'Extreme low worm perspective'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-camera/low-angle.webp', name: 'Low Angle', description: 'Powerful upward dramatic view'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-camera/mid-shot.webp', name: 'Midshot', description: 'Balanced upper body framing'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-camera/portrait.webp', name: 'Portrait', description: 'Professional headshot, soft focus'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-camera/tilted.webp', name: 'Tiltshot', description: 'Diagonal skewed visual composition'},
  {image: 'https://d3adwkbyhxyrtq.cloudfront.net/webassets/ai-image-camera/wide-shot.webp', name: 'Wide Shot', description: 'Expansive scene with context'},
];

export const fakeTextBgVideos = [
  {video: "/fake_text/vadoo-ai-gta-2.mp4-preview", name: "gta-2"},
  {video: "/fake_text/vadoo-ai-gta-3.mp4-preview", name: "gta-3"},
  {video: "/fake_text/vadoo-ai-gta-4.mp4-preview", name: "gta-4"},
  {video: "/fake_text/vadoo-ai-gta-5.mp4-preview", name: "gta-5"},
  {video: "/fake_text/vadoo-ai-gta-7.mp4-preview", name: "gta-7"},
  {video: "/fake_text/vadoo-ai-minecraft-1.mp4-preview", name: "minecraft-1"},
  {video: "/fake_text/vadoo-ai-minecraft-2.mp4-preview", name: "minecraft-2"},
  {video: "/fake_text/vadoo-ai-minecraft-3.mp4-preview", name: "minecraft-3"},
  {video: "/fake_text/vadoo-ai-minecraft-5.mp4-preview", name: "minecraft-5"},
  {video: "/fake_text/vadoo-ai-minecraft-8.mp4-preview", name: "minecraft-8"},
  {video: "/fake_text/vadoo-ai-minecraft-9.mp4-preview", name: "minecraft-9"},
  {video: "/fake_text/vadoo-ai-subway-1.mp4-preview", name: "subway-1"},
  {video: "/fake_text/vadoo-ai-subway-2.mp4-preview", name: "subway-2"},
  {video: "/fake_text/vadoo-ai-subway-5.mp4-preview", name: "subway-5"},
  {video: "/fake_text/vadoo-ai-mobile-2.mp4-preview", name: "mobile-2"},
];

export const fakeTextBgLinks = {
  "gta-2" : "https://d3adwkbyhxyrtq.cloudfront.net/fake_text/bg/gta-2.mp4",
  "gta-3" : "https://d3adwkbyhxyrtq.cloudfront.net/fake_text/bg/gta-3.mp4",
  "gta-4" : "https://d3adwkbyhxyrtq.cloudfront.net/fake_text/bg/gta-4.mp4",
  "gta-5" : "https://d3adwkbyhxyrtq.cloudfront.net/fake_text/bg/gta-5.mp4",
  "gta-7" : "https://d3adwkbyhxyrtq.cloudfront.net/fake_text/bg/gta-7.mp4",
  "minecraft-1" : "https://d3adwkbyhxyrtq.cloudfront.net/fake_text/bg/minecraft-1.mp4",
  "minecraft-2" : "https://d3adwkbyhxyrtq.cloudfront.net/fake_text/bg/minecraft-2.mp4",
  "minecraft-3" : "https://d3adwkbyhxyrtq.cloudfront.net/fake_text/bg/minecraft-3.mp4",
  "minecraft-5" : "https://d3adwkbyhxyrtq.cloudfront.net/fake_text/bg/minecraft-5.mp4",
  "minecraft-8" : "https://d3adwkbyhxyrtq.cloudfront.net/fake_text/bg/minecraft-8.mp4",
  "minecraft-9" : "https://d3adwkbyhxyrtq.cloudfront.net/fake_text/bg/minecraft-9.mp4",
  "subway-1" : "https://d3adwkbyhxyrtq.cloudfront.net/fake_text/bg/subway-1.mp4",
  "subway-2" : "https://d3adwkbyhxyrtq.cloudfront.net/fake_text/bg/subway-2.mp4",
  "subway-5" : "https://d3adwkbyhxyrtq.cloudfront.net/fake_text/bg/subway-5.mp4",
  "mobile-2" : "https://d3adwkbyhxyrtq.cloudfront.net/fake_text/bg/mobile-2.mp4",
};

export const languages = [
  { value: "ar-SA", label: "🇸🇦 Arabic (Saudi Arabia)" },
  { value: "ar-AE", label: "🇦🇪 Arabic (UAE)" },	
  { value: "bg", label: "🇧🇬 Bulgarian" },
  { value: "zh", label: "🇨🇳 Chinese" },
  { value: "hr", label: "🇭🇷 Croatian" },
  { value: "cs", label: "🇨🇿 Czech" },
  { value: "da", label: "🇩🇰 Danish" },
  { value: "nl", label: "🇳🇱 Dutch" },
  { value: "en-US", label: "🇺🇸 English (USA)" },
  { value: "en-GB", label: "🇬🇧 English (UK)" },
  { value: "en-AU", label: "🇦🇺 English (Australia)" },
  { value: "en-CA", label: "🇨🇦 English (Canada)" },	
  { value: "tl", label: "🇵🇭 Filipino" },
  { value: "fi", label: "🇫🇮 Finnish" },
  { value: "fr-FR", label: "🇫🇷 French (France)" },
  { value: "fr-CA", label: "🇨🇦 French (Canada)" },	
  { value: "de", label: "🇩🇪 German" },
  { value: "el", label: "🇬🇷 Greek" },  
  { value: "hi", label: "🇮🇳 Hindi" },
  { value: "hu", label: "🇭🇺 Hungarian" },
  { value: "id", label: "🇮🇩 Indonesian" },
  { value: "it", label: "🇮🇹 Italian" },
  { value: "ja", label: "🇯🇵 Japanese" },
  { value: "ko", label: "🇰🇷 Korean" },
  { value: "ms", label: "🇲🇾 Malay" },
  { value: "no", label: "🇳🇴 Norwegian" },
  { value: "pl", label: "🇵🇱 Polish" },
  { value: "pt-BR", label: "🇧🇷 Portuguese (Brazil)" },
  { value: "pt-PT", label: "🇵🇹 Portuguese (Portugal)" },	
  { value: "ro", label: "🇷🇴 Romanian" },
  { value: "ru", label: "🇷🇺 Russian" },
  { value: "sk", label: "🇸🇰 Slovak" },
  { value: "es-ES", label: "🇪🇸 Spanish (Spain)" },
  { value: "es-MX", label: "🇲🇽 Spanish (Mexico)" },	
  { value: "sv", label: "🇸🇪 Swedish" },
  { value: "ta", label: "🇹🇼 Tamil" },
  { value: "te", label: "🇮🇳 Telugu" },	
  { value: "tr", label: "🇹🇷 Turkish" },
  { value: "uk", label: "🇺🇦 Ukrainian" },
  { value: "vi", label: "🇻🇳 Vietnamese" },
  { value: "mr", label: "🇮🇳 Marathi" },
  { value: "kn", label: "🇮🇳 Kannada" },
  { value: "gu", label: "🇮🇳 Gujarati" },
  { value: "ur", label: "🇮🇳 Urdu" },
  { value: "bn", label: "🇮🇳 Bengali" },
  { value: "he", label: "🇮🇱 Hebrew" },
  { value: "ml", label: "🇮🇳 Malayalam" },
  { value: "pa", label: "🇮🇳 Punjabi" },
];

export const themes = {
    Hormozi_1:{
        name: "Hormozi_1",
        isEmojiEnabled: true,
        wordsPerSequence:{total:4,line:2},
        fontSize:80,
        yPos: 400,
        increaseSizeForHighlight:true,
        color:'#ffffff',
        highlightColor:['#FF0000','#00FF00','#FFFF00'],
        backdrops:[
          {
            WebkitTextStroke:'30px #000000',
            filter:'blur(6px)',
          }
        ],
        lineTransform:[
            {
                type:"scale",
                inputRange:[0,1],
                outputRange:[0.7,1]
            }
        ],
        wordTransform:[

        ],
        tilt:true,
        opacity:1,
        transformOrigin:'center',
        fontFamily:'boldFont',
        fontWeight:'',
        textTransform:'uppercase',
        textShadow:'none',
        enterAnimation:{
          config: {
            damping: 200,
          },
          durationInFrames: 20,
        }
    },
    Beast:{
        name: "Beast",
        isEmojiEnabled: true,
        wordsPerSequence:{total:2,line:2},
        fontSize:80,
        yPos: 400,
        color:'#ffffff',
        highlightColor:['#FF0000','#00FF00','#FFFF00'],
        backdrops:[
          {
            WebkitTextStroke:'30px #ffffff',
            filter:'blur(24px)',
          },
          {
            WebkitTextStroke:'20px black',
            filter:'none',
          }
        ],
        lineTransform:[
            
            {
              type:"scale",
              inputRange:[0,1],
              outputRange:[0.9,1]
            }
        ],
        wordTransform:[
          {
            for:0,
            type:"translateX",
            inputRange:[0,0.6,1],
            outputRange:[100,-50,0]
          },
          {
            for:1,
            type:"translateX",
            inputRange:[0,0.6,1],
            outputRange:[-100,50,0]
          },
        
        ],
        opacity:1,
        transformOrigin:'center',
        fontFamily:'komika',
        fontWeight:'',
        textTransform:'uppercase',
        textShadow:'none',
        enterAnimation:{
          config: {
            damping: 200,
          },
          durationInFrames: 5,
        }
    },
    Tracy:{
      name: "Tracy",
      isEmojiEnabled: false,
      wordsPerSequence:{total:5,line:3},
      fontSize:50,
      yPos: 400,
      color:'#ffffff',
      highlightColor:['#ffffff'],
      backdrops:[
        {
          WebkitTextStroke:'',
          filter:'',
        }
      ],
      lineTransform:[
        
      ],
      wordTransform:[
        
      ],
      opacity:0,
      transformOrigin:'center',
      fontFamily:'gabaritoBlack',
      fontWeight:'',
      textTransform:'uppercase',
      textShadow:'0 0 30px #ffffff',
      enterAnimation:{
        config: {
          damping: 200,
        },
        durationInFrames: 5,
      },
      
    },
    Noah:{
      name: "Noah",
      isEmojiEnabled: false,
      wordsPerSequence:{total:5,line:3},
      fontSize:100,
      yPos: 400,
      color:'#ffffff',
      highlightColor:['#FF0000','#00FF00','#FFFF00'],
      backdrops:[
        {
          WebkitTextStroke:'',
          filter:'',
        }
      ],
      lineTransform:[
        {
          type:"scale",
          inputRange:[0,0.6,1],
          outputRange:[0.7,1.2,1]
        }
      ],
      wordTransform:[
        
      ],
      opacity:1,
      transformOrigin:'center',
      fontFamily:'headingProItalic',
      fontWeight:'',
      textTransform:'uppercase',
      textShadow:'-4px -4px 0 #000,5px 5px 0 #000,6px 6px 0 #000,7px 7px 0 #000,8px 8px 0 #000,9px 9px 0 #000,10px 10px 0 #000,11px 11px 0 #000',
      fontStyle:'italic',
      enterAnimation:{
        config: {
          damping: 200,
        },
        durationInFrames: 5,
      }
    },
    Karl:{
      name: "Karl",
      isEmojiEnabled: false,
      wordsPerSequence:{total:7,line:4},
      fontSize:70,
      yPos: 400,
      color:'#ffffff',
      highlightColor:['#ffffff'],
      backdrops:[
        {
          WebkitTextStroke:'2px #000000',
          filter:'none',
        }
      ],
      lineTransform:[
          
      ],
      wordTransform:[
        {
          for:0,
          type:"translateY",
          inputRange:["byFrame"],
          outputRange:[50,0]
        },
        {
          for:1,
          type:"translateY",
          inputRange:["byFrame"],
          outputRange:[50,0]
        },
      ],
      opacity:0,
      transformOrigin:'center',
      fontFamily:'gabaritoMedium',
      fontWeight:'',
      textTransform:'uppercase',
      textShadow:'none',
      enterAnimation:{
        config: {
          damping: 50,
        },
        durationInFrames: 1,
      }
    },
    Luke:{
      name: "Luke",
      isEmojiEnabled: false,
      wordsPerSequence:{total:2,line:2},
      fontSize:70,
      yPos: 400,
      color:'#ffffff',
      highlightColor:['#FF0000','#00FF00','#FFFF00'],
      letterSpacing:true,
      backdrops:[
        {
          WebkitTextStroke:'2px #000000',
          filter:'blur(4px)',
        }
      ],
      lineTransform:[
        {
          type:"translateX",
          inputRange:["byFrame"],
          outputRange:[0,3,-3,0]
        },
        {
          type:"translateY",
          inputRange:["byFrame"],
          outputRange:[0,3,-3,0]
        }
      ],
      wordTransform:[
        {
          for:0,
          type:"translateX",
          inputRange:[0,1],
          outputRange:[70,0]
        },
        {
          for:1,
          type:"translateX",
          inputRange:[0,1],
          outputRange:[-70,0]
        },
      ],
      opacity:1,
      transformOrigin:'center',
      fontFamily:'montserrat',
      fontWeight:'900',
      textTransform:'uppercase',
      textShadow:'none',
      enterAnimation:{
        config: {
          stiffness: 100,
        },
        durationInFrames: 5,
      }
    },
    Devin:{
      name: "Devin",
      isEmojiEnabled: true,
      wordsPerSequence:{total:4,line:2},
      fontSize:90,
      yPos: 400,
      color:'#ffffff',
      animateLineByLine:{propertyName:'fontSize',delta:5},
      highlightColor:['#FF0000','#00FF00','#FFFF00'],
      backdrops:[
        {
          WebkitTextStroke:'20px #000000',
          filter:'blur(4px)',
        }
      ],
      lineTransform:[
        {
          type:"translateX",
          inputRange:["byFrame"],
          outputRange:[0,20,-20,0]
        },
        {
          type:"translateY",
          inputRange:["byFrame"],
          outputRange:[0,20,-20,0]
        },
        
      ],
      wordTransform:[
       
      ],
      rotate:['-15deg','0deg'],
      opacity:1,
      transformOrigin:'center',
      fontFamily:'rubik',
      fontWeight:'900',
      textTransform:'uppercase',
      textShadow:'highlightColor',
      textShadowValue: 30,
      enterAnimation:{
        config: {
          stiffness: 100,
        },
        durationInFrames: 5,
      }
    },
    Hormozi_2:{
      name: "Hormozi_2",
      isEmojiEnabled: true,
      wordsPerSequence:{total:4,line:2},
      fontSize:70,
      yPos: 400,
      color:'#ffffff',
      animateLineByLine:{propertyName:'fontSize',delta:5},
      highlightColor:['#FF0000','#00FF00','#FFFF00'],
      backdrops:[
        {
          WebkitTextStroke:'50px #000000',
          filter:'blur(12px)',
        }
      ],
      lineTransform:[


      ],
      wordTransform:[
      
      ],
      opacity:1,
      transformOrigin:'center',
      fontFamily:'montserrat',
      fontWeight:'900',
      textTransform:'uppercase',
      textShadow:'none',
      enterAnimation:{
        config: {
          stiffness: 100,
        },
        durationInFrames: 5,
      }
    },
    Hormozi_3:{
      name: "Hormozi_3",
      isEmojiEnabled: true,
      wordsPerSequence:{total:4,line:2},
      fontSize:60,
      yPos: 400,
      color:'#ffffff',
      animateLineByLine:{propertyName:'fontSize',delta:5},
      highlightColor:['#FF0000','#00FF00','#FFFF00'],
      backdrops:[
        {
          WebkitTextStroke:'8px #000000',
          filter:'none',
        }
      ],
      lineTransform:[
        {
          type:"scale",
          inputRange:[0,0.6,1],
          outputRange:[0.7,1.1,1]
        }
      ],
      wordTransform:[
      
      ],
      opacity:1,
      transformOrigin:'center',
      fontFamily:'montserrat',
      fontWeight:'900',
      textTransform:'uppercase',
      textShadow:'0 10px #000',
      enterAnimation:{
        config: {
          stiffness: 100,
        },
        durationInFrames: 5,
      }
    },
    Ali:{
      name: "Ali",
      isEmojiEnabled: false,
      wordsPerSequence:{total:4,line:4},
      fontSize:70,
      yPos: 400,
      color:'#000000',
      highlightColor:['#E7E5E7','#1c1e1d','#1c1e1d'],
      useHighlightColorAsBackground:true,
      fixCurrentWordColor:true,
      nextWordOpacity:"51",
      borderRadius:20,
      padding: 10,
      backdrops:[
        {
          WebkitTextStroke:'3px #ffffff',
          filter:'blur(10px)',
        }
      ],
      lineTransform:[
       
      ],
      wordTransform:[
      
      ],
      opacity:1,
      transformOrigin:'center',
      fontFamily:'poppins',
      fontWeight:'',
      textTransform:'',
      textShadow:'none',
      enterAnimation:{
        config: {
          stiffness: 100,
        },
        durationInFrames: 30,
      }
    },
    Celine:{
      name: "Celine",
      isEmojiEnabled: true,
      wordsPerSequence:{total:5,line:3},
      fontSize:80,
      yPos: 400,
      color:'#ffffff',
      highlightColor:['#ffffff','#ffffff','#ffffff'],
      backdrops:[
        {
          WebkitTextStroke:'',
          filter:'',
        }
      ],
      lineTransform:[
       
      ],
      wordTransform:[
      
      ],
      opacity:1,
      transformOrigin:'center',
      fontFamily:'circular',
      fontWeight: '',
      textTransform:'',
      textShadow:'0 9px 5px #222',
      enterAnimation:{
        config: {
         
        },
        durationInFrames: 30,
      }
    },
    Maya:{
      name: "Maya",
      isEmojiEnabled: false,
      wordsPerSequence:{total:2,line:2},
      fontSize:80,
      yPos: 400,
      color:'#febd03',
      letterSpacing:true,
      highlightColor:['#febd03','#febd03','#febd03'],
      backdrops:[
        {
          WebkitTextStroke:'',
          filter:'',
        }
      ],
      lineTransform:[
        {
          type:"translateY",
          inputRange:["byFrame"],
          outputRange:[0,5,-5,0]
        },
      ],
      wordTransform: [
        
       
      ],
      opacity:1,
      transformOrigin:'center',
      fontFamily:'dmSerifDisplay',
      fontWeight:'',
      textTransform:'',
      textShadow:'0 0 10px #fe6903,0 0 10px #febd03,0 4px 6px #000,4px 4px 6px #000,0 6px 10px #000',
      enterAnimation:{
        config: {
         stiffness:40
        },
        durationInFrames: 30,
      }
    },
    Ella:{
      name: "Ella",
      isEmojiEnabled: false,
      wordsPerSequence:{total:4,line:3},
      fontSize:80,
      yPos: 400,
      color:'#ffffff',
      increaseSizeForHighlight:true,
      highlightColor:['#FF0000','#00FF00','#FFFF00'],
      backdrops:[
        {
          WebkitTextStroke:'6px',
          filter:'blur(2px)',
        },
        {
          WebkitTextStroke:'30px #000000',
          filter:'blur(24px)',
        },
      ],
      lineTransform:[
        {
          type:"scale",
          inputRange:["byFrame"],
          outputRange:[0.95,1,1,1]
        },
        {
          type:"translateX",
          inputRange:["byFrame"],
          outputRange:[0,15,-15,0]
        },
        {
          type:"translateY",
          inputRange:["byFrame"],
          outputRange:[0,15,-15,0]
        }
      ],
      wordTransform:[
        
      ],
      opacity:1,
      transformOrigin:'center',
      fontFamily:'montserrat',
      fontWeight:'900',
      textTransform:'uppercase',
      textShadow:'none',
      enterAnimation:{
        config: {
          damping: 200,
        },
        durationInFrames: 30,
      },
      
    },
    Dan:{
      name: "Dan",
      isEmojiEnabled: true,
      wordsPerSequence:{total:4,line:2},
      fontSize:100,
      yPos: 400,
      color:'#ffffff',
      highlightColor:['#00FF00','#FFFF00','#FF0000'],
      backdrops:[
        {
          WebkitTextStroke:'30px #000000',
          filter:'blur(6px)',
        },
      ],
      lineTransform:[
       
      ],
      wordTransform:[
        
      ],
      opacity:1,
      transformOrigin:'center',
      fontFamily:'firaSans',
      fontWeight:'900',
      textTransform:'uppercase',
      textShadow:'none',
      enterAnimation:{
        config: {
          damping: 200,
        },
        durationInFrames: 30,
      },
      
    },
    David:{
      name: "David",
      isEmojiEnabled: true,
      wordsPerSequence:{total:4,line:3},
      fontSize:100,
      yPos: 400,
      color:'#ffffff',
      highlightColor:['#FF0000','#00FF00','#FFFF00'],
      backdrops:[
        {
          WebkitTextStroke:'30px #000000',
          filter:'blur(6px)',
        },
      ],
      lineTransform:[
        {
          type:"scale",
          inputRange:[0,0.6,1],
          outputRange:[0.7,1.2,1]
        }
      ],
      wordTransform:[
        
      ],
      opacity:1,
      transformOrigin:'center',
      fontFamily:'boldFont',
      fontWeight:'',
      textTransform:'uppercase',
      textShadow:'none',
      enterAnimation:{
        config: {
          damping: 200,
        },
        durationInFrames: 5,
      },
      
    },
    Umi:{
      name: "Umi",
      isEmojiEnabled: false,
      wordsPerSequence:{total:4,line:3},
      fontSize:70,
      yPos: 400,
      color:'#ffff23',
      highlightColor:['#ffff23','#ffff23','#ffff23'],
      oneByOneLetter:true,
      backdrops:[
        {
          WebkitTextStroke:'',
          filter:'',
        }
        // {
        //   WebkitTextStroke:'6px #ffff23',
        //   filter:'blur(2px)',
        // },
      ],
      lineTransform:[
       
      ],
      wordTransform:[
        
      ],
      opacity:1,
      transformOrigin:'center',
      fontFamily:'montserrat',
      fontWeight:'500',
      textTransform:'',
      fontStyle:"italic",
      textShadow:"textColor",
      enterAnimation:{
        config: {
          damping: 200,
        },
        durationInFrames: 30,
      },
      
    },
    Iman:{
      name: "Iman",
      isEmojiEnabled: false,
      wordsPerSequence:{total:3,line:2},
      fontSize:70,
      yPos: 400,
      color:'#ffffff',
      isNextLineHighlight:true,
      highlightColor:['#FFFFFF','#FFFFFF','#FFFFFF'],
     
      backdrops:[
        {
          WebkitTextStroke:'3px #000000',
          
        },
      ],
      lineTransform:[
       
      ],
      wordTransform:[
     
      ],
      opacity:1,
      transformOrigin:'center',
      fontFamily:'montserrat',
      fontWeight:'',
      textTransform:'',
      textShadow:'none',
      enterAnimation:{
        config: {
          damping: 200,
        },
        durationInFrames: 30,
      },
      
    },
    William:{
      name: "William",
      isEmojiEnabled: true,
      wordsPerSequence:{total:3,line:2},
      fontSize:90,
      yPos: 400,
      leftRightCenterAnimation:true,
      color:'#ffffff',
     
      highlightColor:['#F5E402','#000000','#FFDB01'],
     
      backdrops:[
        {
          WebkitTextStroke:'3px #000000',
          
        },
      ],
      lineTransform:[
  
      ],
      wordTransform:[
     
      ],
      opacity:1,
      transformOrigin:'center',
      fontFamily:'roboto',
      fontWeight:'900',
      textShadow:'none',
      textTransform:'uppercase',
      enterAnimation:{
        config: {
          damping: 200,
          stiffness:40
        },
        durationInFrames: 30,
      },
      
    },
};

export const plans = [
  {
    "tier":"Starter",
    "slogan":"Get started in content creation",
    "price":{
      "monthly":19,
      "monthly_discounted":9.99,
      "monthly_inr":1645,
      "monthly_inr_discounted":864.99,
      "yearly":13.33,
      "yearly_inr":1158.25
    },
    "discount": "First Month 50% Off",
    "id": "Starter_New4",
    "isCurrent":false,
    "benefits":[
      "1500 credits/month",
      "2 parallel tasks",
      "Buy 70 credits for 1$",
      "Schedule 3 times a Week",
      "AI Videos",	    
      "AI Images",	    
      "AI Music",	    
      "AI Training",	    
      "AI captions, B-roll and Transitions",	    
    ]
  },
  {
    "tier":"Pro",
    "slogan":"Best option to improve your content",
    "price":{
      "monthly":39,
      "monthly_discounted":24.99,
      "monthly_inr":3375,
      "monthly_inr_discounted":2164.99,
      "yearly":27.3,
      "yearly_inr":2365
    },
    "discount": "First Month 40% Off",
    "id": "Pro_New4",
    "isCurrent":false,
    "benefits":[
      "3500 credits/month",
      "6 parallel tasks",
      "Buy 80 credits for 1$",
      "Schedule Once A Day",
      "AI Videos",	    
      "AI Images",	    
      "AI Music",	    
      "AI Training",	    
      "AI captions, B-roll and Transitions",	    
    ]
  },
  {
    "tier":"Advance",
    "slogan":"Perfect for multiple clients",
    "price":{
      "monthly":69,
      "monthly_discounted":44.99,
      "monthly_inr":5950,
      "monthly_inr_discounted":3894,
      "yearly":48.3,
      "yearly_inr":4182.5
    },
    "discount": "First Month 40% Off",
    "id": "Advance_New4",
    "isCurrent":false,
    "benefits":[
      "7500 credits/month",
      "20 parallel tasks",
      "Buy 90 credits for 1$",
      "Schedule Twice A Day",	    
      "AI Videos",	    
      "AI Images",	    
      "AI Music",	    
      "AI Training",	    
      "AI captions, B-roll and Transitions",	    
    ]
  },
];

export function sendAnalyticsEvent(event_name){
  if(event_name==null || event_name===""){
     console.error("Event name is empty")
  }else{
     const postData = {
        event_name : event_name
          };
          
          const headers = {
            'Content-Type': 'application/json'
          }
          
          axios.post('/api/send_analytics_event', postData, {headers: headers})
            .then(response => {
              // handle success
              console.log(response);
            })
            .catch(error => {
              // handle error
              console.error(error);
            });    
  }
};

export function sendFbAnalyticsEvent(event_name){
  if(event_name==null || event_name===""){
     console.error("Event name is empty")
  }else{
     const postData = {
        event_name : event_name
          };

          const headers = {
            'Content-Type': 'application/json'
          }

          axios.post('/api/send_fb_analytics_event', postData, {headers: headers})
            .then(response => {
              // handle success
              console.log(response);
            })
            .catch(error => {
              // handle error
              console.error(error);
            });
  }
};

export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, params);
  }
};

export const getFormattedPauseData = (pauseData,durationInFrames)=>{
  let previousEnd = 0
  if(pauseData && pauseData.length > 0) {
    const seq=[]
    pauseData.forEach(([ start, end ]) => {
      if (start > previousEnd) {
        seq.push({ start: previousEnd, end: start});
      }
    previousEnd = end;
  });
  if (previousEnd < (durationInFrames/30)) {
    console.log("end",{ start: previousEnd, end: (durationInFrames/30) })
    seq.push({ start: previousEnd, end: (durationInFrames/30) });
  }

  return seq
}};

export const adjustSubtitles = (pauseData,currentSubtitles,durationInFrame) => {
    let currentTimeInMs = 0; // Track the non-silent time in milliseconds
    const updatedSubtitles = [];
    const sequences = getFormattedPauseData(pauseData,durationInFrame)
    sequences.forEach(({ start, end }) => {
      const startInMs = start * 1000;
      const endInMs = end * 1000;

      // Filter and adjust subtitles for this non-silent segment
      const activeSubtitles = currentSubtitles.filter(subtitle => {
        return subtitle.from >= startInMs && subtitle.to <= endInMs;
      });

    

      // Update subtitle offsets to match the current non-silent timeline
      activeSubtitles.forEach(subtitle => {
        const originalFrom = subtitle.from;
        const originalTo = subtitle.to;
        const newFrom = currentTimeInMs + (originalFrom - startInMs);
        const newTo = currentTimeInMs + (originalTo - startInMs);

        // Retain all properties of the subtitle and update the 'from' and 'to' times
        updatedSubtitles.push({
          ...subtitle, // Spread the original subtitle properties
          from: newFrom,
          to: newTo,
        });
      });

      currentTimeInMs += (end - start) * 1000; // Accumulate non-silent time in ms
    });

    console.log("updatedSubtitles",updatedSubtitles);
    

   return updatedSubtitles; 
    
};

export const adjustBrollData = (pauseData,brollData,durationInFrame) => {
  let currentTimeInMs = 0; // Track the non-silent time in milliseconds
    const updatedBroll = [];
    const sequences = getFormattedPauseData(pauseData,durationInFrame)
    sequences.forEach(({ start, end }) => {
      const startInMs = start * 1000;
      const endInMs = end * 1000;

      const activeBroll= brollData.filter(broll => {
        return broll.start >= startInMs && broll.end <= endInMs;
      });
       activeBroll.forEach(broll => {
        const originalFrom = broll.start;
        const originalTo = broll.end;
        const newFrom = currentTimeInMs + (originalFrom - startInMs);
        const newTo = currentTimeInMs + (originalTo - startInMs);

        
        updatedBroll.push({
          ...broll, 
          start: newFrom,
          end: newTo,
        });
      });

      currentTimeInMs += (end - start) * 1000; // Accumulate non-silent time in ms
    });

   return updatedBroll; 

};

// Function to adjust timings for subtitles and audio effects
export const adjustAudioEffects = (audioEffectsData, silenceIntervals, videoDuration) => {
  const adjustedAudioEffects = audioEffectsData.length >0 ?audioEffectsData.map((audioEffectData) => {
    const { subtitle } = audioEffectData;
    const adjustedSubtitle = adjustSubtitleTiming(subtitle, silenceIntervals, videoDuration);

    return {
      ...audioEffectData,
      subtitle: adjustedSubtitle,
    };
  }):[];

  return adjustedAudioEffects
};

// Function to adjust subtitle timing based on non-silent segments
const adjustSubtitleTiming = (subtitle, silenceIntervals, videoDuration) => {
  
  let newFrom = subtitle.from;
  let newTo = subtitle.to;

  silenceIntervals.forEach(([start, end]) => {
    if (subtitle.from / 1000 >= start && subtitle.from / 1000 < end) {
      // Adjust 'from' if it's within a silent section
      newFrom = end * 1000;
    }
    if (subtitle.to / 1000 >= start && subtitle.to / 1000 < end) {
      // Adjust 'to' if it's within a silent section
      newTo = start * 1000;
    }
  });

  if (newTo > videoDuration * 1000) {
    newTo = videoDuration * 1000;
  }
  return {
    ...subtitle,
    from: newFrom,
    to: newTo,
  };
};

export const getSubtitles = (pauseData,subRefCurrent,originalDuration,selectedDubbedAudio,theme,translatedCaption) =>{
  let subtitle = subRefCurrent

  if (translatedCaption && translatedCaption!== "default") {
    subtitle = groupWords(translatedCaption.translation,theme)
} else if (selectedDubbedAudio) {
    // If there’s a dubbed audio, show its transcript
    subtitle =  groupWords(selectedDubbedAudio.transcript, theme);
}
  
  if(pauseData.length > 0 ){
   
    return adjustSubtitles(pauseData,subtitle,originalDuration)
  }
 
  return subtitle
};

/**
 * Update the transcript object based on the addition and removal of words from the captions
 */
export const updateTranscript = (subtitles,operation,word=null) =>{
  console.log(subtitles)
  let transcript = []
  if(subtitles != null && subtitles.length !== 0){

   for (const subtitle of subtitles) {
    const subtitleItem = adjustWordsInRange(subtitle,operation,word)
    transcript = [...transcript, ...subtitleItem]
   }
  }
  return transcript


};

function adjustWordsInRange(obj,operation,word) {
  const result = [];
  if(operation==1){
    for (let i = 0; i < obj.words.length; i++) {
      const wordObject = {
          offsets: {
              from: obj.wordStamps[i],
              to: obj.wordStamps[i + 1] || obj.to
          },
          text: obj.words[i]
      };

      result.push(wordObject);
    }

  }else if(operation==0){
    if(word!=null){
      for (let i = 0; i < obj.words.length; i++) {
        if (obj.words[i] !== word) { // Add only if the word does not match
            const wordObject = {
                offsets: {
                    from: obj.wordStamps[i],
                    to: obj.wordStamps[i + 1] || obj.to
                },
                text: obj.words[i]
            };
            result.push(wordObject);
        }
    }
    }
    
  }
 
  return result;
};

const CHUNK_SIZE = 5
export const groupIntoChunks = (data, chunkSize=CHUNK_SIZE) =>{
  const grouped = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const start = chunk[0].start;
    const end = chunk[chunk.length - 1].end;
    grouped.push({ chunk, start, end });
  }
  return grouped;
};
