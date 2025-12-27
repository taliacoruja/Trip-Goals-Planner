import type { Category } from '../../../../shared/types/domain';
import type { ListboxOption } from '../../../../shared/ui/Listbox/Listbox';

const CATEGORY_COPY: Record<Category, { label: string; hint?: string }> = {
    docs: { label: 'Docs', hint: 'The boring stuff that saves you later' },
    packing: { label: 'Packing', hint: 'Socks: optional. Charger: not.' },
    money: { label: 'Money', hint: 'Because dreams have invoices' },
    health: { label: 'Health', hint: 'Hydrate. Sleep. Try.' },
    booking: { label: 'Booking', hint: 'Pay now, regret later' },
    other: { label: 'Other', hint: 'A safe place for chaos' },
};

export const CATEGORY_OPTIONS: ListboxOption<Category>[] = (
    Object.keys(CATEGORY_COPY) as Category[]
).map((value) => ({ value, ...CATEGORY_COPY[value] }));
