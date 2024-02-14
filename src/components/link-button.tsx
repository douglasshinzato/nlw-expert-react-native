import { Link, LinkProps } from "expo-router"

type LinkButtonProps = LinkProps<string> & {
  title: String
}

export function LinkButton({ title, ...rest }: LinkButtonProps) {
  return (
    <Link className="text-slate-300 text-center text-base font-body" {...rest}>
      {title}
    </Link>
  )
}
