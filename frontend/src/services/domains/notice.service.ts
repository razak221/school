import { supabase, ORG_ID } from './common';

export const noticeService = {
  getNotices: async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const notices = (data || []).map((n) => ({
        _id: n.id,
        title: n.title,
        body: n.body,
        category: n.category?.toLowerCase() || 'academic',
        targetAudience: [n.target_audience || 'All'],
        isPinned: n.is_pinned || false,
        translations: n.translations || {},
        createdAt: n.created_at,
        createdBy: {
          name: n.published_by || 'Headmaster Office',
          role: 'Administrator',
        },
      }));
      return { success: true, count: notices.length, notices };
    } catch {
      return {
        success: true,
        count: 0,
        notices: [],
      };
    }
  },

  createNotice: async (payload: any) => {
    try {
      const { error } = await supabase.from('notices').insert({
        organization_id: ORG_ID,
        title: payload.title,
        body: payload.body,
        category: payload.category || 'Academic',
        target_audience: payload.targetAudience?.[0] || 'All',
        published_by: 'Headmaster Office',
        is_pinned: !!payload.isPinned,
        translations: payload.translations || {},
      });

      if (error) {
        console.error('createNotice error:', error);
        return { success: false, message: error.message || 'Failed to publish notice.' };
      }

      return { success: true, message: 'Notice published and broadcasted to school community.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to publish notice.' };
    }
  },
};
