import { vadooAPI } from '../../lib/vadoo';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({ multiples: false, maxFileSize: 100 * 1024 * 1024 }); // 100MB limit
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: 'Error parsing form data' });
      }

      const prompt = Array.isArray(fields.prompt) ? fields.prompt[0] : fields.prompt;
      const effect = Array.isArray(fields.effect) ? fields.effect[0] : fields.effect;
      const aspectRatio = Array.isArray(fields.aspectRatio) ? fields.aspectRatio[0] : fields.aspectRatio;
      const duration = Array.isArray(fields.duration) ? fields.duration[0] : fields.duration;
      const style = Array.isArray(fields.style) ? fields.style[0] : fields.style;
      const motion = Array.isArray(fields.motion) ? fields.motion[0] : fields.motion;

      if (!effect || !aspectRatio || !duration) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      let imageBuffer = undefined;
      let imageName = undefined;
      let imageType = undefined;
      if (files.image) {
        const file = Array.isArray(files.image) ? files.image[0] : files.image;
        if (file && file.filepath) {
          imageBuffer = fs.readFileSync(file.filepath);
          imageName = file.originalFilename || 'image.jpg';
          imageType = file.mimetype || 'image/jpeg';
        }
      }

      const result = await vadooAPI.generateVideo({
        prompt: prompt || undefined,
        image: imageBuffer,
        imageName,
        imageType,
        effect,
        aspectRatio,
        duration: parseInt(duration),
        style: style || undefined,
        motion: motion || undefined,
      });

      res.status(200).json(result);
    });
  } catch (error) {
    console.error('Error in generate-video API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
