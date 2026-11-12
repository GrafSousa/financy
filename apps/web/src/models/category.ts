import type { IconName } from 'lucide-react/dynamic';

import { CategoryColor } from '@financy/contracts';

export interface Category {
  id: string;
  name: string;
  color: CategoryColor;
  icon: IconName;
  description?: string | null;
}
