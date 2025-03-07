import cnn from '@/utils/ccn';
import st from './Label.module.scss';

interface Props {
  title?: React.ReactNode;
  children: React.ReactNode;
  description?: React.ReactNode;
  center?: boolean;
}
export const Label = (props: Props) => {
  return (
    <label className={st.label}>
      <div
        className={cnn({
          [st['title']]: true,
          [st['title--center']]: props.center,
        }).join(' ')}
      >
        {props.title}
      </div>
      <div className={st.control}></div> {props.children}
      <div className={cnn({
          [st['description']]: true,
          [st['description--center']]: props.center,
        }).join(' ')}>{props.description}</div>
    </label>
  );
};
