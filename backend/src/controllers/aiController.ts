import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { resumeParser } from '../services/ai/ResumeParserService';
import { jdParser } from '../services/ai/JdParserService';
import { atsService } from '../services/ai/AtsService';
import { optimizerService } from '../services/ai/OptimizerService';
import { query } from '../config/db';

export class AiController {
  static async parseResume(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // In production, use multer to process req.file. For now, we assume rawText is passed.
      const { rawText } = req.body;
      const parsedData = await resumeParser.parseStructured(rawText);
      
      // Store in DB
      const result = await query(
        'INSERT INTO resumes (user_id, file_name, storage_url, raw_text, parsed_data) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [req.user?.id, 'manual_upload.txt', 'local', rawText, JSON.stringify(parsedData)]
      );

      res.status(200).json({ status: 'success', data: { resumeId: result.rows[0].id, parsedData } });
    } catch (error) {
      next(error);
    }
  }

  static async parseJd(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { title, rawText } = req.body;
      const parsedData = await jdParser.parseStructured(rawText);
      
      // Store in DB
      const result = await query(
        'INSERT INTO job_descriptions (user_id, title, raw_text, parsed_data) VALUES ($1, $2, $3, $4) RETURNING id',
        [req.user?.id, title, rawText, JSON.stringify(parsedData)]
      );

      res.status(200).json({ status: 'success', data: { jdId: result.rows[0].id, parsedData } });
    } catch (error) {
      next(error);
    }
  }

  static async scoreAts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { resumeId, jdId } = req.body;
      // Fetch from DB
      const resumeRes = await query('SELECT parsed_data FROM resumes WHERE id = $1 AND user_id = $2', [resumeId, req.user?.id]);
      const jdRes = await query('SELECT parsed_data FROM job_descriptions WHERE id = $1 AND user_id = $2', [jdId, req.user?.id]);

      if (!resumeRes.rows[0] || !jdRes.rows[0]) {
        throw new Error('Resume or JD not found');
      }

      const score = await atsService.scoreResume(resumeRes.rows[0].parsed_data, jdRes.rows[0].parsed_data);
      
      // Store result
      await query(
        `INSERT INTO ats_results (resume_id, job_description_id, overall_score, keyword_match_score, skill_match_score, experience_score, gap_analysis) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [resumeId, jdId, score.overall_score, score.keyword_match_score, score.skill_match_score, score.experience_score, JSON.stringify(score)]
      );

      res.status(200).json({ status: 'success', data: score });
    } catch (error) {
      next(error);
    }
  }

  static async optimizeResume(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { resumeId, missingKeywords } = req.body;
      const resumeRes = await query('SELECT parsed_data FROM resumes WHERE id = $1 AND user_id = $2', [resumeId, req.user?.id]);
      
      const optimized = await optimizerService.optimizeResume(resumeRes.rows[0].parsed_data, missingKeywords);
      
      // Save version
      await query(
        'INSERT INTO resume_versions (resume_id, version_number, optimized_data) VALUES ($1, $2, $3)',
        [resumeId, 1, JSON.stringify(optimized)] // Simplified version logic
      );

      res.status(200).json({ status: 'success', data: optimized });
    } catch (error) {
      next(error);
    }
  }
}
