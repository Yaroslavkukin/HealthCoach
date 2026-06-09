insert into biomarker_catalog (code, name, system_code, default_unit, description)
values
('testosterone_total', 'Testosterone', 'hormonal', 'nmol/L', 'Total testosterone'),
('testosterone_free', 'Free Testosterone', 'hormonal', 'pg/ml', 'Free testosterone'),
('cortisol', 'Cortisol', 'stress_recovery', 'nmol/L', 'Stress and recovery marker'),
('tsh', 'TSH', 'thyroid', 'mIU/L', 'Thyroid stimulating hormone'),
('free_t3', 'Free T3', 'thyroid', 'pmol/L', 'Free triiodothyronine'),
('free_t4', 'Free T4', 'thyroid', 'pmol/L', 'Free thyroxine'),
('vitamin_d', 'Vitamin D', 'nutritional', 'ng/ml', '25-OH vitamin D'),
('vitamin_b12', 'Vitamin B12', 'nutritional', 'pg/ml', 'Cobalamin'),
('ferritin', 'Ferritin', 'nutritional', 'ng/ml', 'Iron storage marker'),
('hba1c', 'HbA1c', 'metabolic', '%', 'Long-term glucose regulation'),
('insulin', 'Insulin', 'metabolic', 'µIU/ml', 'Insulin marker'),
('crp', 'CRP', 'inflammation', 'mg/L', 'Inflammation marker')
on conflict (code) do nothing;
