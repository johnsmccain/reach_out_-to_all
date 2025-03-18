/*
  # Add Statistics Table

  1. New Tables
    - statistics
      - id (uuid, primary key)
      - states_covered (integer)
      - outreaches_conducted (integer)
      - locals_reached (integer)
      - communities_reached (integer)
      - souls_won (integer)
      - rededication_commitments (integer)
      - medical_beneficiaries (integer)
      - welfare_beneficiaries (integer)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS
    - Public read access
    - Admin-only write access
*/

CREATE TABLE IF NOT EXISTS statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  states_covered integer NOT NULL DEFAULT 0,
  outreaches_conducted integer NOT NULL DEFAULT 0,
  locals_reached integer NOT NULL DEFAULT 0,
  communities_reached integer NOT NULL DEFAULT 0,
  souls_won integer NOT NULL DEFAULT 0,
  rededication_commitments integer NOT NULL DEFAULT 0,
  medical_beneficiaries integer NOT NULL DEFAULT 0,
  welfare_beneficiaries integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE statistics ENABLE ROW LEVEL SECURITY; 

CREATE POLICY "Anyone can view statistics"
  ON statistics
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify statistics"
  ON statistics
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin');

-- Insert initial statistics
INSERT INTO statistics (
  states_covered,
  outreaches_conducted,
  locals_reached,
  communities_reached,
  souls_won,
  rededication_commitments,
  medical_beneficiaries,
  welfare_beneficiaries
) VALUES (0, 0, 0, 0, 0, 0, 0, 0);