// ProductLink.jsx — Link wrapper that auto-wires view-transition morphs.

//
// USAGE
//   <ProductLink to={`/products/${id}`} morphId={`product-${id}`}>
//     <img src={...} alt={...} />     {/* gets viewTransitionName: product-${id} */}
//     <h3>{title}</h3>
//   </ProductLink>
//
// On the destination page, render the same id:
//   <img src={...} style={{ viewTransitionName: `product-${id}` }} />
//
// React Router v6 — set unstable_viewTransition on RouterProvider (or on the
// individual <Link>). This wrapper sets it for you.

import * as React from "react";
import { Children, cloneElement, isValidElement } from "react";
import { Link } from "react-router-dom";

export default function ProductLink({
  to,
  morphId,
  children,
  className,
  ...rest
}) {
  let firstApplied = false;
  const mapped = Children.map(children, (child) => {
    if (!firstApplied && isValidElement(child) && morphId) {
      firstApplied = true;
      return cloneElement(child, {
        style: {
          ...(child.props.style || {}),
          viewTransitionName: morphId,
        },
      });
    }
    return child;
  });

  return (
    <Link
      to={to}
      unstable_viewTransition
      className={className}
      {...rest}
    >
      {mapped}
    </Link>
  );
}