import { FeatureModule, FeatureContext } from '../../core/registry';

export const exampleFeature: FeatureModule = {
  name: 'example',
  
  onBoot: async (context: FeatureContext) => {
    console.log('[Feature] Booting example...');
    
    // 1. Dynamic DB Migrations (Stateless Bridge Adapter Pattern)
    context.db.registerMigration('example', `
      CREATE TABLE IF NOT EXISTS example_demo (
        id SERIAL PRIMARY KEY,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // 2. Register feature endpoints
    context.router.get('/api/example', async (req, res) => {
      try {
        const result = await context.db.query('SELECT * FROM example_demo');
        res.json({ success: true, feature: 'example', data: result.rows });
      } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
      }
    });
  },

  onStart: async (context: FeatureContext) => {
    console.log('[Feature] Started example.');
  },

  onShutdown: async (context: FeatureContext) => {
    console.log('[Feature] Shutdown example.');
  }
};
