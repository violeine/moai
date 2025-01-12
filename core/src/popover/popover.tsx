import { Placement } from "@popperjs/core";
import { Fragment, useCallback, useState } from "react";
import { PopoverPane } from "./pane/pane";

interface TargetProps {
	toggle: () => void;
	opened: boolean;
}

interface ContentProps {
	close: () => void;
}

export interface PopoverProps {
	/**
	 * The component that will be render Popover when action on it. The Popover will be positioned relative to this element
	 */
	target: (props: TargetProps) => React.ReactNode;
	/**
	 * The elements to be displayed within the Popover
	 */
	content: (props: ContentProps) => React.ReactNode;
	/**
	 * `target`'s wrapper, that mean you can change `div` tag to any `JSX.Element` you want.
	 *
	 * The usually case is change wrapper between "block" or "inline"
	 */
	TargetWrapper?: () => JSX.Element;
	/**
	 * Describes the preferred placement of the Popover relative to the `target`.
	 *
	 * [Reference](https://popper.js.org/docs/v2/constructors/#options) to the Popper's Placement type
	 */
	placement?: Placement;
}

const DefaultTargetWrapper = (props: {
	setTarget: (element: HTMLDivElement | null) => void;
	children: React.ReactNode;
}): JSX.Element => <div ref={props.setTarget} children={props.children} />;

/**
 * A Popover is a pop-up container. It can also contain controls.
 *
 * Popover are displayed when triggered by a user action, usally by clicking.
 */
export const Popover = (props: PopoverProps): JSX.Element => {
	const [opened, setOpened] = useState(false);
	const [target, setTarget] = useState<HTMLDivElement | null>(null);

	const toggle = useCallback(() => setOpened((b) => !b), []);
	const close = useCallback(() => void setOpened(false), []);
	const TargetWrapper = props.TargetWrapper ?? DefaultTargetWrapper;

	return (
		<Fragment>
			<TargetWrapper setTarget={setTarget}>
				{props.target({ toggle, opened })}
			</TargetWrapper>
			{opened && target && (
				<PopoverPane
					children={props.content({ close })}
					target={target}
					placement={props.placement}
					onOutsideClick={close}
				/>
			)}
		</Fragment>
	);
};

Popover.styles = PopoverPane.styles;
