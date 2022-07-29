// Fill out your copyright notice in the Description page of Project Settings.


#include "PlayerUI.h"
#include "Components/TextBlock.h"


void UPlayerUI::SetText(FString String)
{
	ViewText->SetText(FText::FromString(String));
}