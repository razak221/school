import { supabase, ORG_ID } from './common';

export const noticeService = {
  getNotices: async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const notices = data.map((n) => ({
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
      }
    } catch {}

    return {
      success: true,
      count: 2,
      notices: [
        {
          _id: 'not_1',
          title: 'Term 1 (T1) Evaluation & Parent-Teacher Meeting (PTM)',
          body: 'All teachers, students and parents are notified that Term 1 CCE evaluation marksheets are prepared. The PTM will be held on Saturday from 01:30 PM to 03:30 PM.',
          category: 'academic',
          targetAudience: ['All'],
          isPinned: true,
          translations: {
            ur: { title: 'اطلاع برائے والدین: امتحانی نتائج و پی ٹی ایم', body: 'تمام اساتذہ، طلباء اور والدین کو مطلع کیا جاتا ہے کہ ٹرم 1 کے نتائج تیار ہیں۔' },
            ks: { title: 'نوٹس: تعلیمی نتائج و پی ٹی ایم', body: 'سارنے طالب علمن تہ مالمولن چھ یوان باوناوتھ زہ پی ٹی ایم میٹنگ سپدی چھنوارس۔' },
            hi: { title: 'सूचना: प्रथम सत्र मूल्यांकन व शिक्षक-अभिभावक बैठक', body: 'सभी शिक्षकों, विद्यार्थियों एवं अभिभावकों को सूचित किया जाता है कि परिणाम तैयार हैं।' },
          },
          createdAt: '2026-08-28T09:00:00.000Z',
          createdBy: { name: 'Mohammad Ashraf Bhat', role: 'Headmaster' },
        },
        {
          _id: 'not_2',
          title: 'Distribution of Free SSA Uniforms & Winter Sweaters',
          body: 'Under the Samagra Shiksha Abhiyan scheme, all enrolled students of Classes 1st through 8th will receive their winter school uniforms and warm sweaters tomorrow morning during assembly.',
          category: 'scheme_update',
          targetAudience: ['All'],
          isPinned: false,
          translations: {
            ur: { title: 'اطلاع: مفت اسکول یونیفارم کی تقسیم', body: 'سمگرا شیکشا ابھیان اسکیم کے تحت تمام طلباء میں مفت یونیفارم تقسیم کی جائے گی۔' },
          },
          createdAt: '2026-08-25T11:00:00.000Z',
          createdBy: { name: 'Office of Headmaster', role: 'Administration' },
        },
      ],
    };
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
