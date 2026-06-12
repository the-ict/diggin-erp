import { MenuItem } from '../lib/model';
import { useTranslations } from 'next-intl';

const RenderMobileMenuItem = (item: MenuItem) => {
  const t = useTranslations();

  return (
    <a
      key={item.title}
      href={item.url}
      className="text-md font-semibold flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-indigo-600"
    >
      {item.icon && <item.icon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />}
      <span>{t(item.title)}</span>
    </a>
  );
};

export default RenderMobileMenuItem;
